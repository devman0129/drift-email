require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../models/userModel");
const sendEmail = require("../services/sendEmail");
const { validateLoginInput } = require("../validation/login");
const { validateRegisterInput } = require("../validation/register");
const { STATUS_CODE, ACTIVE_STATUS } = require("../utils/constants");
const { OAuth2Client } = require("google-auth-library");
const { email_body } = require("../utils/inviteEmailTemplate");
const { active_email_body } = require("../utils/activedEmailTemplate");
const axios = require("axios");

const register = (req, res) => {
  let { name, email, role, invitor } = req.body;

  const data = {
    name: name,
    email: email,
    password: config.DEFAULT_PASSWORD,
    password2: config.DEFAULT_PASSWORD,
  };

  const { errors, isValid } = validateRegisterInput(data);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  userModel.findOne({ email: email }).then((user) => {
    if (user) {
      return res
        .status(STATUS_CODE.ALREADY_EXIST.CODE)
        .json({ code: STATUS_CODE.ALREADY_EXIST.CODE });
    } else {
      const newUser = new userModel({
        name: name,
        email: email,
        password: config.DEFAULT_PASSWORD,
        role: role,
        picture: "",
        status: ACTIVE_STATUS.DISACTIVE.CODE,
        added_date: Date.now(),
        temporarytoken: jwt.sign({ email: email }, config.JWT_SECRET, {
          expiresIn: config.TOKEN_EXPIRED_TIME,
        }),
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(() => {
            const confirmURL = `${process.env.MAIL_CONFIRM_URL}newUser/${newUser.temporarytoken}`;
            const emailRegister = {
              to: newUser.email,
              subject: `You've been invited to Reply Intelligence`,
              text: `Hello ${newUser.name}, ${invitor}  has invited you to join them in Reply Intelligence`,
              html: email_body(newUser.name, invitor, confirmURL),
            };
            sendEmail
              .sendInvite(emailRegister)
              .then((result) => {
                if (result)
                  return res
                    .status(STATUS_CODE.OK.CODE)
                    .json({ code: STATUS_CODE.OK.CODE });
              })
              .catch((err) => {
                return res
                  .status(STATUS_CODE.BAD_REQUEST.CODE)
                  .json({ code: STATUS_CODE.BAD_REQUEST.CODE });
              });
          });
        });
      });
    }
  });
};

const login = (req, res) => {
  const data = { email: req.body.email, password: req.body.password };
  const { errors, isValid } = validateLoginInput(data);

  if (!isValid) {
    return res
      .status(STATUS_CODE.BAD_REQUEST.CODE)
      .json({ code: STATUS_CODE.BAD_REQUEST.CODE });
  }

  email = data.email;
  password = data.password;
  userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_CODE.BAD_REQUEST.CODE)
          .json({ code: STATUS_CODE.BAD_REQUEST.CODE, message: "Auth Failed" });
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                name: user.name,
                role: user.role,
                picture: user.picture,
              },
              config.JWT_SECRET,
              {
                expiresIn: config.TOKEN_EXPIRED_TIME,
              }
            );
            userData = { name: user.name, email: user.email };
            return res
              .status(STATUS_CODE.OK.CODE)
              .json({ code: STATUS_CODE.OK.CODE, token, userData });
          }
          return res.status(STATUS_CODE.UNAUTHORIZED.CODE).json({
            code: STATUS_CODE.UNAUTHORIZED.CODE,
            message: "Invalid password",
          });
        })
        .catch((error) =>
          res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
            code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE,
            error: error,
          })
        );
    })
    .catch((error) =>
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE)
        .json({ code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE, error: error })
    );
};

const resendInvite = (req, res) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        (user.temporarytoken = jwt.sign(
          { email: req.body.email },
          config.JWT_SECRET,
          {
            expiresIn: config.TOKEN_EXPIRED_TIME,
          }
        )),
          user
            .save()
            .then(() => {
              const confirmURL = `${process.env.MAIL_CONFIRM_URL}newUser/${user.temporarytoken}`;
              const emailRegister = {
                to: req.body.email,
                subject: `You've been invited to Reply Intelligence`,
                text: `Hello ${req.body.name}, ${req.body.invitor}  has invited you to join them in Reply Intelligence`,
                html: email_body(req.body.name, req.body.invitor, confirmURL),
              };
              sendEmail.sendInvite(emailRegister).then((result) => {
                if (result)
                  return res
                    .status(STATUS_CODE.OK.CODE)
                    .json({ code: STATUS_CODE.OK.CODE });
              });
            })
            .catch((err) => {
              res
                .status(STATUS_CODE.BAD_REQUEST.CODE)
                .send({ code: STATUS_CODE.BAD_REQUEST.CODE });
            });
      }
    })
    .catch((err) => {
      res
        .status(STATUS_CODE.BAD_REQUEST.CODE)
        .send({ code: STATUS_CODE.BAD_REQUEST.CODE });
    });
};

const verify = (req, res) => {
  userModel
    .findOne({ temporarytoken: req.params.token })
    .then((user) => {
      const token = req.params.token; // Save the token from URL for verification
      // Function to verify the user's token
      jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(STATUS_CODE.BAD_REQUEST.CODE).json({
            code: STATUS_CODE.BAD_REQUEST.CODE,
            message: "Activation link has expired..",
          }); // Token is expired
        } else if (!user) {
          res.status(STATUS_CODE.BAD_REQUEST.CODE).json({
            code: STATUS_CODE.BAD_REQUEST.CODE,
            message: "Activation link has expired.",
          }); // Token may be valid but does not match any user in the database
        } else {
          user.temporarytoken = false; // Remove temporary token
          user.status = ACTIVE_STATUS.ACTIVE.CODE; // Change account status to Activated
          const password = req.body.password;
          // Mongoose Method to save user into the database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user
                .save()
                .then((resultRecord) => {
                  // If save succeeds, create e-mail object
                  const redirectURL = `${[process.env.MAIL_CONFIRM_URL]}`;
                  const emailActivate = {
                    to: user.email,
                    subject: "Your Account Activated",
                    text: `Hello ${user.name}, Your account has been successfully activated!`,
                    html: active_email_body(user.name, redirectURL),
                  };
                  // Send e-mail object to user
                  sendEmail.sendInvite(emailActivate).then((result) => {
                    if (result) {
                      const token = jwt.sign(
                        {
                          userId: resultRecord._id,
                          email: resultRecord.email,
                          name: resultRecord.name,
                          role: resultRecord.role,
                          picture: resultRecord.picture,
                        },
                        config.JWT_SECRET,
                        {
                          expiresIn: config.TOKEN_EXPIRED_TIME,
                        }
                      );
                      return res.status(STATUS_CODE.OK.CODE).json({
                        code: STATUS_CODE.OK.CODE,
                        message: "User has been successfully activated",
                        token,
                      });
                    }
                  });
                })
                .catch((err) => {
                  res
                    .status(STATUS_CODE.BAD_REQUEST.CODE)
                    .send({ code: STATUS_CODE.OK.CODE });
                });
            });
          });
        }
      });
    })
    .catch((error) =>
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE)
        .json({ code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE, error: error })
    );
};

const getGoogleUser = async (access_token) => {
  const resultFromGoogleApi = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return resultFromGoogleApi;
};

const googleLogin = (req, res) => {
  const tokenResponse = req.body;
  getGoogleUser(tokenResponse.access_token)
    .then((result) => {
      const { email, picture } = result.data;
      userModel
        .findOne({ email })
        .then((user) => {
          if (!user) {
            return res.status(STATUS_CODE.BAD_REQUEST.CODE).json({
              code: STATUS_CODE.BAD_REQUEST.CODE,
              message: "This is Unregistered User",
            });
          }
          const token = jwt.sign(
            {
              email: user.email,
              name: user.name,
              role: user.role,
              picture,
            },
            config.JWT_SECRET,
            {
              expiresIn: config.TOKEN_EXPIRED_TIME,
            }
          );
          user.picture = picture;
          user.updated_date = Date.now();
          console.log(user);
          user
            .save()
            .then(() =>
              res
                .status(STATUS_CODE.OK.CODE)
                .json({ code: STATUS_CODE.OK.CODE, token })
            );
        })
        .catch((error) =>
          res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
            code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE,
            error: error,
          })
        );
    })
    .catch((error) =>
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE)
        .json({ code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE, error: error })
    );
};

module.exports = {
  register,
  verify,
  login,
  resendInvite,
  googleLogin,
};

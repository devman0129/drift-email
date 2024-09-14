//import model
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { STATUS_CODE } = require("../utils/constants");

const getAll = (req, res) => {
  userModel
    .find()
    .then((users) => {
      res.status(STATUS_CODE.OK.CODE).json({
        code: STATUS_CODE.OK.CODE,
        result: users,
      });
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

const getOne = (req, res) => {
  userModel
    .findOne({ email: req.email })
    .then((user) => {
      if (!user)
        res.status(STATUS_CODE.BAD_REQUEST.CODE).send("data is not found");
      else {
        newUser = {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
        res.json({
          code: STATUS_CODE.OK.CODE,
          result: newUser,
        });
      }
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        errors: "Something went wrong",
      });
    });
};

const updateById = (req, res) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        if (user.email === req.email) {
          return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
            code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE,
            error: "Something went wrong",
          });
        }
        user.name = req.body.name;
        user.role = req.body.role;
        user.updated_date = Date.now();

        user
          .save()
          .then((result) => {
            res.status(STATUS_CODE.OK.CODE).json({ success: true });
          })
          .catch((err) => {
            res
              .status(STATUS_CODE.BAD_REQUEST.CODE)
              .send("update not possible");
          });
      } else res.status(STATUS_CODE.NOT_FOUND.CODE).send("data is not found");
    })
    .catch((err) => {
      return res.json({
        ccode: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE,
        error: "Something went wrong",
      });
    });
};

const updateOne = (req, res) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        res.status(STATUS_CODE.NOT_FOUND.CODE).send("data is not found");
      else {
        user.name = req.body.name;
        user.updated_date = Date.now();
      }
      user
        .save()
        .then((result) => {
          res.status(STATUS_CODE.OK.CODE).json({ success: 200 });
        })
        .catch((err) => {
          res.status(STATUS_CODE.BAD_REQUEST.CODE).send("update not possible");
        });
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

const updateOnePassword = (req, res) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
      } else {
        user.updated_date = Date.now();
        const password = req.body.password;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then((result) => {
                res.status(STATUS_CODE.OK.CODE).json({ success: true });
              })
              .catch((err) => {
                res
                  .status(STATUS_CODE.BAD_REQUEST.CODE)
                  .send("update not possible");
              });
          });
        });
      }
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

const deleteOne = (req, res) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      if (!user)
        res
          .status(STATUS_CODE.BAD_REQUEST.CODE)
          .send({ error: "data is not found" });
      else {
        userModel
          .findByIdAndRemove(req.params.id)
          .then((result) => {
            res.status(STATUS_CODE.OK.CODE).json({
              success: true,
            });
          })
          .catch((err) => {
            return res.json({
              errors: [
                {
                  code: STATUS_CODE.INTERNAL_SERVER_ERROR.CODE,
                  error: "Something went wrong",
                },
              ],
            });
          });
      }
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

module.exports = {
  getAll,
  getOne,
  updateById,
  updateOne,
  deleteOne,
  updateOnePassword,
};

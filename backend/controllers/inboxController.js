const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const inboxModel = require("../models/inboxModel");
const { STATUS_CODE, INBOX_STATUS_CODE } = require("../utils/constants");
const { isEmpty } = require("../validation/isEmpty");
const axios = require("axios");
const { constants } = require("http2");
const { error } = require("console");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_INBOX_CLIENT_ID,
  process.env.GOOGLE_INBOX_CLIENT_SECRET,
  process.env.GOOGLE_INBOX_REDIRECT_URL
);

/**
 * Access Scopes
 */
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

// Get credentials.json file
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * get client_id, client_secret, refresh_token from credentials.json
 */
async function makeToken(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  return payload;
}

/**
 * This will provide an object with the access_token and refresh_token.
 *
 */
async function getAccessToken(code) {
  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}
/**
 * Main function
 * get user @param {client} credentials
 * get @param token from @param credentials
 * using @param token fetch user profile, email
 * save new inbox data with @param token / update @param token
 */
const integrateInbox = async (req, res) => {
  const { authorizationCode } = req.body;

  try {
    const oauth2Client = await getAccessToken(authorizationCode);

    const token = await makeToken(oauth2Client);
    if (token) {
      console.log("_______________token was created_______________");
      const resultFromGoogleApi = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
          },
        }
      );
      if (resultFromGoogleApi.data.verified_email === false) throw new error();

      const inboxAccount = await inboxModel.findOne({
        email: resultFromGoogleApi.data.email,
      });

      if (isEmpty(inboxAccount)) {
        const newInboxAccount = new inboxModel({
          name: resultFromGoogleApi.data.name,
          email: resultFromGoogleApi.data.email,
          status: 1,
          added_date: Date.now(),
          updated_date: Date.now(),
          token: token,
        });

        newInboxAccount.save().then((result) => {
          res.status(INBOX_STATUS_CODE.SUCCESS.CODE).json({
            CODE: INBOX_STATUS_CODE.SUCCESS.CODE,
            RESULT: INBOX_STATUS_CODE.SUCCESS.KEY,
            TYPE: "NEW",
            DETAIL: "Added new inbox account successfully",
          });
        });
      } else {
        inboxAccount.status = 1;
        inboxAccount.token = token;
        inboxAccount.save().then((result) => {
          res.status(INBOX_STATUS_CODE.SUCCESS.CODE).json({
            CODE: INBOX_STATUS_CODE.SUCCESS.CODE,
            RESULT: INBOX_STATUS_CODE.SUCCESS.KEY,
            TYPE: "UPDATE",
            DETAIL: "Updated inbox account successfully",
          });
        });
      }
    } else {
      return res.status(INBOX_STATUS_CODE.ERROR.CODE).json({
        CODE: INBOX_STATUS_CODE.ERROR.CODE,
        RESULT: INBOX_STATUS_CODE.ERROR.KEY,
        DETAIL: "No Token",
        ERROR: err,
      });
    }
  } catch (e) {
    return res.status(INBOX_STATUS_CODE.ERROR.CODE).json({
      CODE: INBOX_STATUS_CODE.ERROR.CODE,
      RESULT: INBOX_STATUS_CODE.ERROR.KEY,
      DETAIL: "Something went wrong",
      ERROR: e,
    });
  }
};

const getInboxList = (req, res) => {
  inboxModel
    .find()
    .then((inboxs) => {
      res.status(STATUS_CODE.OK.CODE).json({
        code: STATUS_CODE.OK.CODE,
        result: inboxs,
      });
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

const updateInbox = (req, res) => {
  const { name, email } = req.body;
  inboxModel
    .findOne({ email: email })
    .then((inbox) => {
      if (!inbox)
        res.status(STATUS_CODE.NOT_FOUND.CODE).send("data is not found");
      else {
        inbox.name = name;
        inbox.update_date = Date.now();
      }
      inbox
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

const deleteInbox = (req, res) => {
  inboxModel
    .findById(req.params.id)
    .then((inbox) => {
      if (!inbox)
        res.status(STATUS_CODE.NOT_FOUND.CODE).send("data is not found");
      else {
        inboxModel
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

const getURL = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  return res.json({ redirectURL: url });
};

module.exports = {
  integrateInbox,
  getInboxList,
  updateInbox,
  deleteInbox,
  getURL,
};

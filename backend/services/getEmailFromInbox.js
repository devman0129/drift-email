const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const axios = require("axios");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const mailModel = require("../models/mailModel");
const inboxModel = require("../models/inboxModel");
const { INBOX_STATUS_CODE } = require("../utils/constants");
const { isEmpty } = require("../validation/isEmpty");
var base64 = require("js-base64").Base64;
const cron = require("node-cron");
require("dotenv").config();

/**
 * return @param {credentialObject, inboxAddedDate} credentialList
 *
 * get @param credential from DB and make credential file.
 */
const getCredentialList = async () => {
  const credentialList = [];

  try {
    const inboxes = await inboxModel.find();
    if (isEmpty(inboxes)) return false;
    inboxes.forEach((item) => {
      const credential = JSON.parse(item.token);
      credential.client_email = item.email;
      let userEmail = item.email;
      let inboxAddedDate = item.added_date;
      const credentialObject = google.auth.fromJSON(credential);
      if (credentialObject) {
        credentialList.push({ credentialObject, inboxAddedDate, userEmail });
      } else {
        console.log("no credential");
      }
    });
    return credentialList;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("/");
};

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */

async function getEmailFromGoogleInbox(gmail, inboxAddedDate, userEmail) {
  try {
    const added_date = formatDate(inboxAddedDate);
    const mails = await gmail.users.messages.list({
      userId: "me",
      q: `after: ${added_date} -in:sent`,
    });
    if (isEmpty(mails)) return 0;
    else return mails;
  } catch (error) {
    return {
      status: false,
      failedUserEmail: userEmail,
    };
  }
}

const parseOneMessage = (gmail, Id) =>
  new Promise((resolve, reject) =>
    gmail.users.messages.get(
      {
        userId: "me",
        id: Id,
      },
      (err, res) => {
        if (err) reject(`The API returned an error: ${err}`);

        let messageData = res.data;
        let header = messageData.payload.headers;
        let from = "";
        let date = "";
        let subject = "";
        let to = "";
        let message = "";

        header.forEach((item) => {
          switch (item.name) {
            case "From":
              from = item.value;
              break;
            case "Date":
              date = item.value;
              break;
            case "Subject":
              subject = item.value;
              break;
            case "To":
              to = item.value;
              break;
          }
        });

        switch (messageData.payload.mimeType) {
          case "multipart/alternative":
            message = messageData.payload.parts[1].body.data;
            break;
          case "multipart/mixed":
            for (const part of messageData.payload.parts[0].parts) {
              if (part.mimeType == "text/html") message = part.body.data;
            }
            break;
          case "multipart/related":
            message = messageData.payload.parts[0].parts[1].body.data;
            break;
          case "text/plain":
            message = messageData.payload.body.data;
            break;
          case "text/html":
            message = messageData.payload.body.data;
            break;
          default:
            // message = messageData.payload.body.data;
            console.log(messageData, 3333333);
            resolve(null);
        }

        const decoded = base64.decode(
          message.replace(/-/g, "+").replace(/_/g, "/")
        );

        if (!decoded) {
          resolve(null);
        }

        const mail = new mailModel({
          mailId: messageData.id ?? "",
          threadId: messageData.threadId ?? "",
          labelIds: messageData.labelIds ?? "",
          snippet: messageData.snippet ?? "",
          sizeEstimate: messageData.sizeEstimate ?? "",
          historyId: messageData.historyId ?? "",
          internalDate: messageData.internalDate ?? "",
          mimeType: messageData.payload.mimeType ?? "",
          filename: messageData.payload.filename ?? "",
          from: from ?? "",
          date: date ?? "",
          subject: subject ?? "",
          to: to ?? "",
          message: decoded ?? "",
        });

        resolve(mail);
      }
    )
  );

const getEmailList = async (credentialList) => {
  let mails = [];

  for (let oneCredential of credentialList) {
    let auth = oneCredential.credentialObject;
    const gmail = google.gmail({ version: "v1", auth });
    const mailListForOneCredential = await getEmailFromGoogleInbox(
      gmail,
      oneCredential.inboxAddedDate,
      oneCredential.userEmail
    );

    if (mailListForOneCredential?.status === false) {
      console.log(
        mailListForOneCredential.failedUserEmail,
        "user removed access"
      );
      inboxModel
        .findOneAndUpdate(
          { email: mailListForOneCredential.failedUserEmail },
          { $set: { status: 0 } },
          { returnOriginal: false }
        )
        .then((res) => console.log("updated status to", res.status));
    }

    let messages = mailListForOneCredential?.data?.messages;
    if (messages) {
      for (const message of messages) {
        const isExist = await mailModel.findOne({
          mailId: message.id,
        });
        if (isExist) continue;

        console.log(
          "Unread messages found:",
          message.id,
          "--------------",
          message.threadId
        );

        const oneMessage = await parseOneMessage(gmail, message.id);
        if (oneMessage) {
          mails.push(oneMessage);
        }
      }
    } else {
      console.log("There is no Unread new email for this credential");
    }
  }

  return mails;
};

const saveEmails = async (credentialList) => {
  try {
    const mailList = await getEmailList(credentialList);

    if (mailList.length !== 0) {
      let result = await mailModel.insertMany(mailList);
      return Object.keys(result).length;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getEmailFromAccount = async (req, res) => {
  console.log("get emails from Account");

  const credentialList = await getCredentialList();

  const result = await saveEmails(credentialList);
  if (result) {
    res.json({ result: `${result} new mails added` });
    console.log(`${result} records added`);
  } else {
    res.json({ result: `No mail added` });
    console.log(`No record added`);
  }
};

module.exports = {
  getEmailFromAccount,
};

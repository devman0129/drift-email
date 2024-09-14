require('dotenv').config();

const AWS = require('aws-sdk');
var mimemessage = require('mimemessage');

if (!AWS.config.region) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });
}

var params = {
  Source: 'noreply@replyintelligence.io',
  Destination: {
    ToAddresses: ['joy.talentless@gmail.com'],
  },
  ReplyToAddresses: ['joy.talentless@gmail.com'],
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: `It is <strong>WORKING</string>`,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Node + SES Example',
    },
  },
};

const sendInvite = async (emailContent) => {
  var title = emailContent.subject;
  var receiver = emailContent.to;
  var body = emailContent.html;
  let default_body = `<p>This is mail from Reply Intelligence</p>`;
  let email_title = title.length > 0 ? title : 'Invite Email';
  let email_body = body ? body : default_body;

  var mailContent = mimemessage.factory({
    contentType: 'multipart/mixed',
    body: [],
  });
  mailContent.header('From', 'noreply@replyintelligence.io');
  mailContent.header('To', receiver);
  mailContent.header('Subject', email_title);

  console.log('=============== sending email =================', receiver);
  var alternateEntity = mimemessage.factory({
    contentType: 'multipart/alternate',
    body: [],
  });
  var htmlEntity = mimemessage.factory({
    contentType: 'text/html;charset=utf-8',
    body:
      '   <html>  ' +
      '   <head></head>  ' +
      '   <body>  ' +
      '   <h1></h1>  ' +
      email_body +
      '   </body>  ' +
      '  </html>  ',
  });
  var plainEntity = mimemessage.factory({
    body: email_body,
  });
  alternateEntity.body.push(htmlEntity);

  mailContent.body.push(alternateEntity);

  var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendRawEmail({
      RawMessage: { Data: mailContent.toString() },
    })
    .promise();

  return new Promise((resolve, reject) => {
    sendPromise
      .then((data) => {
        console.log(
          '-------------------------email success--------------------',
          data.MessageId
        );
        resolve(true);
      })
      .catch(function (err) {
        console.error(
          '-------------------------email error--------------------',
          err,
          err.stack
        );
        reject(err);
      });
  });
};

module.exports = {
  sendInvite,
};

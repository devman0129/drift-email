//import model
const { ApiGatewayManagementApi } = require("aws-sdk");
const mailModel = require("../models/mailModel");
const { isEmpty } = require("../validation/isEmpty");

const getMailList = async (req, res) => {
  const filter = req.body.filter;
  let query = {};
  for (let filterItem in filter) {
    if (!isEmpty(filter[filterItem])) {
      switch (filterItem) {
        case "date":
          query = {
            date: {
              $gte: new Date(filter[filterItem][0]),
              $lte: new Date(filter[filterItem][1]),
            },
            ...query,
          };
          break;
        case "search":
          query = {
            $or: [
              { subject: { $regex: filter[filterItem], $options: "i" } },
              { snippet: { $regex: filter[filterItem], $options: "i" } },
              { message: { $regex: filter[filterItem], $options: "i" } },
            ],
            ...query,
          };
          break;
        case "source":
          query = {
            to: { $in: filter[filterItem] },
            ...query,
          };
          break;
        default:
          break;
      }
    }
  }
  const mailList = [];
  try {
    await mailModel
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$threadId",
            count: { $sum: 1 },
          },
        },
      ])
      .then(async (result, err) => {
        if (err) throw err;
        for (const thread of result) {
          await mailModel
            .find(
              { threadId: thread._id },
              {
                subject: 1,
                from: 1,
                snippet: 1,
                date: 1,
                internalDate: 1,
                mailId: 1,
                threadId: 1,
              }
            )
            .then((mails, err) => {
              if (err) throw err;
              if (thread.count === 1) mailList.push(...mails);
              else {
                let latestMail = { internalDate: null };
                for (const mail of mails) {
                  if (latestMail?.internalDate < mail.internalDate) {
                    const {
                      mailId,
                      threadId,
                      snippet,
                      internalDate,
                      from,
                      date,
                      subject,
                    } = mail;
                    latestMail = {
                      mailId,
                      threadId,
                      snippet,
                      internalDate,
                      from,
                      date,
                      subject,
                      count: thread.count,
                    };
                  }
                }
                mailList.push(latestMail);
              }
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    mailList.sort((a, b) => {
      const dateA = a.internalDate;
      const dateB = b.internalDate;
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      // names must be equal
      return 0;
    });
    res.status(200).json(mailList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMailDetail = (req, res) => {
  var id = req.params.id;
  try {
    mailModel.find({ mailId: id }, {}).then((mail) => {
      const threadId = mail[0].threadId;
      mailModel.find({ threadId: threadId }, {}).then((mails, err) => {
        if (err) throw err;
        res.status(200).json(mails);
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMailList,
  getMailDetail,
};

const typeModel = require("../models/typeModel");
const { STATUS_CODE } = require("../utils/constants");
const { isEmpty } = require("../validation/isEmpty");

const addType = (req, res) => {
  const keywords = req.body.keywords;
  const name = req.body.typeName;
  const color = req.body.color;
  const email = req.body.email;

  console.log(keywords, name, color, email);

  typeModel
    .findOne({ name: name })
    .then((type) => {
      if (type) {
        return res
          .status(STATUS_CODE.ALREADY_EXIST.CODE)
          .json({ code: STATUS_CODE.ALREADY_EXIST.CODE });
      } else {
        const newType = new typeModel({
          name: name,
          email: email,
          keyword: keywords,
          color: color,
        });
        newType.save().then((result) => {
          if (!isEmpty(result)) {
            return res
              .status(STATUS_CODE.OK.CODE)
              .json({ code: STATUS_CODE.OK.CODE });
          }
        });
      }
    })
    .catch((err) =>
      res
        .status(STATUS_CODE.BAD_REQUEST.CODE)
        .json({ code: STATUS_CODE.BAD_REQUEST.CODE })
    );
};

const editType = (req, res) => {
  const editDate = req.body.typeData;
  console.log(editDate);
  typeModel
    .findById(editDate.id)
    .then((type) => {
      (type.name = editDate.typeName),
        (type.email = editDate.email),
        (type.keyword = editDate.keywords),
        (type.color = editDate.color);
      type.save().then((result) => {
        if (result)
          return res
            .status(STATUS_CODE.OK.CODE)
            .json({ code: STATUS_CODE.OK.CODE });
      });
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

const getTypes = (req, res) => {
  typeModel
    .find({ isDeleted: 0 })
    .then((types) => {
      res.status(STATUS_CODE.OK.CODE).json({
        code: STATUS_CODE.OK.CODE,
        result: types,
      });
    })
    .catch((err) => {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR.CODE).json({
        error: "Something went wrong",
      });
    });
};

const deleteType = (req, res) => {
  typeModel
    .findOne({ name: req.body.name })
    .then((type) => {
      if (type) {
        type.isDeleted = 1;
        type.save().then((result) => {
          if (result)
            return res
              .status(STATUS_CODE.OK.CODE)
              .json({ code: STATUS_CODE.OK.CODE });
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
  addType,
  getTypes,
  deleteType,
  editType,
};

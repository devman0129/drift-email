const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const mailController = require("../controllers/mailController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const inboxController = require("../controllers/inboxController");
const typeController = require("../controllers/typeController");
const getEmailFromInbox = require("../services/getEmailFromInbox");
const { authentification } = require("../middleware/authMiddleware");

//Mail Router
router.post("/api/getMailList", authentification, (req, res) => {
  mailController.getMailList(req, res);
});
router.get("/api/getEmailDetail/:id", authentification, (req, res) => {
  mailController.getMailDetail(req, res);
});
router.get("/api/mail/refresh", authentification, (req, res) => {
  getEmailFromInbox.getEmailFromAccount(req, res);
});

//Inbox Router
router.post("/api/inbox/integrateInbox", authentification, (req, res) => {
  inboxController.integrateInbox(req, res);
});
router.get("/api/inbox/getInboxList", authentification, (req, res) => {
  inboxController.getInboxList(req, res);
});
router.post("/api/inbox/updateInbox", authentification, (req, res) => {
  inboxController.updateInbox(req, res);
});
router.delete("/api/inbox/deleteInbox/:id", authentification, (req, res) => {
  inboxController.deleteInbox(req, res);
});
router.get("/api/inbox/getURL", authentification, (req, res) => {
  inboxController.getURL(req, res);
});

//Auth Router
router.post("/api/user/register", authentification, (req, res) => {
  authController.register(req, res);
});
router.post("/api/user/login", (req, res) => {
  authController.login(req, res);
});
router.post("/api/user/googleLogin", (req, res) => {
  authController.googleLogin(req, res);
});
router.post("/api/user/resendInvite", authentification, (req, res) => {
  authController.resendInvite(req, res);
});
router.post("/api/user/confirmation/:token", (req, res) => {
  authController.verify(req, res);
});

//User Router
router.get("/api/user/getAll", authentification, (req, res) => {
  userController.getAll(req, res);
});
router.post("/api/user/getOne", authentification, (req, res) => {
  userController.getOne(req, res);
});
router.post("/api/user/update/:id", authentification, (req, res) => {
  userController.updateById(req, res);
});
router.post("/api/user/updateOne", authentification, (req, res) => {
  userController.updateOne(req, res);
});
router.post("/api/user/updateOnePassword", authentification, (req, res) => {
  userController.updateOnePassword(req, res);
});
router.delete("/api/user/delete/:id", authentification, (req, res) => {
  userController.deleteOne(req, res);
});

//Type Router
router.post("/api/type/addType", authentification, (req, res) => {
  typeController.addType(req, res);
});

router.post("/api/type/editType", authentification, (req, res) => {
  typeController.editType(req, res);
});

router.get("/api/type/getTypes", authentification, (req, res) => {
  typeController.getTypes(req, res);
});

router.post("/api/type/deleteType", authentification, (req, res) => {
  typeController.deleteType(req, res);
});

module.exports = router;

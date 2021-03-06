const express = require("express");
const multer = require("multer");
//-------------------------
const uploadConfig = require("./config/upload");
const upload = multer(uploadConfig);
//--------------------------
const verifyToken = require("./config/verifyToken");
//--------------------------
const routes = express.Router();
//express.Router() is for complex routes, for different USERS, POSTS etc.
//For simple APP not necessarily to use Express.Router()
//--------------------------------------
//Controllers are the callback functions (in another file) that passed to the app methods.
//routes.js > controllers/UserController.js
const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");
const DashboardController = require("./controllers/DashboardController");
const LoginController = require("./controllers/LoginController");
const RegistrationController = require("./controllers/RegistrationController");
const ApprovalController = require("./controllers/ApprovalController");
const RejectionController = require("./controllers/RejectionController");
//=======================================
//======================================
//TEST route
routes.get("/status", (req, res) => {
  res.send({ status: 200 });
});
//============ CRUD ===================
//EVENT REGISTRATION (BOOKING)
//create booking
routes.post("/registration/:eventId", verifyToken, RegistrationController.create);
routes.get("/registration", verifyToken, RegistrationController.getMyRegistrations);
//get particular booking
routes.get("/registration/:registration_id", RegistrationController.getRegistration);
routes.post("/registration/:registration_id/approvals", verifyToken, ApprovalController.approval);
routes.post("/registration/:registration_id/rejections", verifyToken, RejectionController.rejection);
//USER LOGIN
//If your login request is via a user supplying a username and password then a POST is preferable, as details will be sent in the HTTP messages body rather than the URL. Although it will still be sent plain text, unless you're encrypting via https
routes.post("/login", LoginController.storeAuth);
//DASHBOARD
routes.get("/dashboard/:sport", verifyToken, DashboardController.getAllEvents);
routes.get("/dashboard", verifyToken, DashboardController.getAllEvents);
routes.get("/user/events", verifyToken, DashboardController.getEventsByUserId);
routes.get("/event/:eventId", verifyToken, DashboardController.getEventById);
//EVENTS
// routes.get("/events", EventController.getAllEvents);
// routes.get("/events/:sport", EventController.getSport);
// routes.get("/event/:eventId", EventController.getEventById);
routes.post("/event", verifyToken, upload.single("thumbnail"), EventController.createEvent);
routes.delete("/event/:eventId", verifyToken, EventController.deleteEvent);
//USER
routes.post("/user/register", UserController.createUser);
routes.get("/user/:userId", UserController.getUserById);

module.exports = routes;

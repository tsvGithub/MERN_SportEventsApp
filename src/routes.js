const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");
const upload = multer(uploadConfig);
const routes = express.Router();
//express.Router() is for complex routes, for different USERS, POSTS etc.
//For simple APP not necessarily to use Express.Router()
//--------------------------------------
//Controllers are the callback functions (in another file) that passed to the app methods.
//routes.js > controllers/UserController.js
const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");

routes.get("/status", (req, res) => {
  res.send({ status: 200 });
});
//============ CRUD ===================
//EVENT
routes.get("/event/:eventId", EventController.getEventById);
routes.post("/event", upload.single("thumbnail"), EventController.createEvent);

//USER
//Controllers are the callback functions (in another file) that passed to the app methods.
//controllers>UserConttroller
routes.post("/user/register", UserController.createUser);
routes.get("/user/:userId", UserController.getUserById);

module.exports = routes;

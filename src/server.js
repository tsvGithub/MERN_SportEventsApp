const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// console.log(process.env.MONGODB_URI);

const UserController = require("./controllers/UserController");

const PORT = process.env.PORT || 8000;
//-----------------
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
//   console.log(process.env.MONGODB_URI);
// }
//-----------------
app.use(cors());
app.use(express.json());
//----------------------
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sportevents";
// console.log(uri);
try {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log("MongoDB connected");
} catch (error) {
  console.log(error);
}
//============ CRUD ===================
//Read
app.get("/", (req, res) => {
  res.send("Hello!");
});
//Read
app.get("/register", (req, res) => {
  res.send("Register route");
});
//Create
//Controllers are the callback functions (in another file) we passed to the app methods.
//controllers>UserConttroller
app.post("/register", UserController.store);

//================================
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

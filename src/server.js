const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const PORT = process.env.PORT || 8000;
//connection socket
const server = http.Server(app);
const io = socketio(server);

require("dotenv").config();
// console.log(process.env.MONGODB_URI);
// console.log(process.env.SUPER_MARIO);

//----------------------------------------
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
//   console.log(process.env.MONGODB_URI);
// }
//------
//SOCKET
//not ideal solution  => better use Redis instead:
const connectUsers = {};
io.on("connection", (socket) => {
  // console.log("User is connected", socket.id);
  // io.emit("Zhur", { data: "Hello from Zhur server!" });
  // console.log(socket.handshake.query);
  const { user } = socket.handshake.query;
  connectUsers[user] = socket.id;
});
//-----------------
app.use((req, res, next) => {
  req.io = io;
  req.connectUsers = connectUsers;
  return next();
});
//------------------
app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "files")));
app.use(routes);
//===================================
//MongoDB
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
//================================
server.listen(PORT, () => {
  // app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

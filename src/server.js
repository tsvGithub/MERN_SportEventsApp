const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const path = require("path");
const PORT = process.env.PORT || 8000;

require("dotenv").config();
// console.log(process.env.MONGODB_URI);

//----------------------------------------
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
//   console.log(process.env.MONGODB_URI);
// }
//------
//-----------------
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
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

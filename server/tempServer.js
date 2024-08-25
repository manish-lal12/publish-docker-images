const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const { Mongoose } = require("mongoose");

//middlewares
// app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.static(path.join(__dirname, "../app/dist")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//routes
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../app/dist", "/index.html"));
});

app.post("/createProfile", async (req, res) => {
  let userObj = req.body;

  console.log("Attempting to connect to db..");

  MongoClient.connect("mongodb://admin:pass@localhost:27107");
});
app.get("/getProfile", async (req, res) => {
  let response = res;

  await MongoClient.connect(
    "mongodb://admin:pass@localhost:27107",
    function (err, client) {
      if (err) throw err;

      let db = client.db("user-account");
      let query = { userid: 1 };
      db.collection("users").findOne(query, function (err, result) {
        if (err) throw err;
        client.close();
        response.send(result);
      });
    }
  );
  res.json({ profile: "get Profile" });
});

app.post("/updateProfile", async function (req, res) {
  let userObj = req.body;
  let response = res;

  console.log("connecting to db....");

  await MongoClient.connect(
    "mongodb://admin:password@localhost:27107",
    function (err, client) {
      console.log("in client");

      if (err) {
        console.log(err);
      }

      let db = client.db("user-account");
      userObj["userid"] = 1;
      let query = { userid: 1 };
      let newValues = { $set: userObj };
      console.log("Successfully connected to user-account db");

      db.collection("users").updateOne(
        query,
        newValues,
        { upsert: true },
        function (err, res) {
          if (err) throw err;
          console.log("Successfully updated or inserted");
          client.close();
          response.send(userObj);
        }
      );
    }
  );
  res.json({ msg: "update profile" });
});

app.get("/getProfilePic", async (req, res) => {
  res.json({ msg: "get profile pic" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});

// const connectDB = async (url) => {
//   await mongoose.connect(url);
//   app.listen(3000, () => {
//     console.log("Server is listening on port 3000...");
//   });
// };

// connectDB();

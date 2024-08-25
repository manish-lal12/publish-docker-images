const express = require("express");
const app = express();
const { connectDB, getDB, client } = require("./connectDB");
const database = "user-account";
const path = require("path");
const { ObjectId, ReturnDocument } = require("mongodb");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173, http://localhost:27017",
  })
);

//middlewares to parse JSON and urlEncoded(form data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../app/dist")));
// app.get("/", async (req, res) => {
//   res.sendFile(path.join(__dirname, "../app/dist/index.html"));
// });

// //serve static files
app.use(express.static("./public"));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/getAllProfile", async (req, res) => {
  try {
    // in mongo native driver, collection.find() returns a cursor that is combined with toArray() to get all data inside it, the cursor doesnot contain data itself, but can be used to iterate and retrieve data
    const profiles = await users.find().toArray();
    res.status(200).json({ profiles });
  } catch (error) {
    res.json(500).json({ msg: error.message });
  }
});

app.get("/getProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // here, new ObjectID() creates a new instance of ObjectId
    const profile = await users.findOne({ _id: new ObjectId(id) });
    if (!profile) {
      return res.status(404).json({ msg: `User with id: ${id} doesnot exist` });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/createProfile", async (req, res) => {
  try {
    const reqUserProfile = req.body;
    const result = await users.insertOne(reqUserProfile);
    // console.log(reqUserProfile); [probable bug]

    res.status(201).json({ msg: "Profile created", profile: reqUserProfile });
  } catch (error) {
    console.log(error);
  }
});

app.patch("/updateProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          interest: req.body.interest,
        },
      },
      { returnDocument: "after" }
    );

    if (!profile) {
      return res.status(404).json({ msg: `User with id: ${id} doesnot exist` });
    }
    res.json({ msg: "User updated success", profile });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.delete("/deleteProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await users.findOneAndDelete({ _id: new ObjectId(id) });
    if (!profile) {
      return res.status(404).json({ msg: `User with id: ${id} doesnot exist` });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

const start = async () => {
  try {
    let url = `mongodb://user:password@mongodb/${database}`;
    // global variable "db"
    db = await connectDB(url);
    // global  variable "users" [collection]
    users = db.collection("users");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000..");
    });
  } catch (error) {
    console.log(error);
  }
};
start();

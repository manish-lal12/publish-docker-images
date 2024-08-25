const { MongoClient } = require("mongodb");
// const mongoose = require("mongoose");
let client;
let db;

const connectDB = async (url) => {
  try {
    client = new MongoClient(url);
    await client.connect();
    db = client.db();
    console.log("Database connected");
    return db;
  } catch (error) {
    console.log(error);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB, client };

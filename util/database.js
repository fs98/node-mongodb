const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://fsefer:LiPopatUrvG1mKJ0@cluster0.tofog5q.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;

const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  static getById(id) {
    const db = getDb();
    console.log(id);
    return db
      .collection("users")
      .findOne({
        _id: mongodb.ObjectId(id),
      })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  store() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = User;

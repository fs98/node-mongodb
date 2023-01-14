const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  static getAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getById(id) {
    const db = getDb();
    console.log(id);
    return db
      .collection("products")
      .find({
        _id: mongodb.ObjectId(id),
      })
      .toArray()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  store() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static updateById(id, title, price, imageUrl, description) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne(
        { _id: mongodb.ObjectId(id) },
        {
          $set: {
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
          },
        }
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static destroy(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({
        _id: mongodb.ObjectId(id),
      })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;

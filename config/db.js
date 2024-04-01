const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const local = "mongodb://127.0.0.1:27017/MyDatabase";

const atlas =
  "mongodb+srv://haiconk95:Pr43atSBxEUFiL2h@cluster0.erlzz2v.mongodb.net/MyDatabase";

const connect = async () => {
  try {
    await mongoose.connect(local, {
    });
    console.log("connect success");
  } catch (error) {
    console.log(error);
    console.log("connect fail");
  }
};

module.exports = { connect };

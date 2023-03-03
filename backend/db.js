const { MongoClient } = require("mongodb");

const connectionString = process.env.DB_LINK || "";

const client = new MongoClient(connectionString);

let conn;
const connfunc = async () => {
  try {
    conn = await client.connect();
  } catch (e) {
    console.error(e);
  }
};

connfunc();

let db = conn.db("sample_training");

module.exports.db;

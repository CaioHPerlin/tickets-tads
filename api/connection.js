const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  database: "dbtickets",
  port: 3306,
  user: "root",
  password: "root",
});

module.exports = connection;

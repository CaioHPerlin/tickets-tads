const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "db",
  database: "dbtickets",
  port: 3306,
  user: "root",
  password: "123123",
});

module.exports = connection;

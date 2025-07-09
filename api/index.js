const express = require("express");
const cors = require('cors')

const PORT = 3000;

const app = express();
const connection = require("./connection");
const tables = require("./tables");
const ticketsRoutes = require("./routes/tickets.routes");
const usersRoutes = require("./routes/users.routes");
const errors = require("./utils/errors");

tables.init(connection);

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS
app.set("view engine", "ejs");

// Routes
app.get("/ping", (_, res) => res.send("pong"));
app.use("/tickets", ticketsRoutes);
app.use("/users", usersRoutes);

// Error handling middleware
app.use(errors.handleErrors);

app.listen(PORT, () => {
  console.info(`[INFO] Server running on http://localhost:${PORT}`);
});

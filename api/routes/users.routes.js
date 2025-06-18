const express = require("express");
const usersController = require("../controller/users.controller");

const usersRoutes = express.Router();

usersRoutes.post("/login", usersController.login);
usersRoutes.get("/", usersController.findAll);
usersRoutes.get("/:id", usersController.findById);
usersRoutes.get("/email/:email", usersController.findByEmail);
usersRoutes.post("/", usersController.create);
usersRoutes.put("/:id", usersController.update);
usersRoutes.delete("/:id", usersController.delete);

module.exports = usersRoutes;

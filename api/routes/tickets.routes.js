const express = require("express");
const ticketsController = require("../controller/tickets.controller");
const ticketsRoutes = express.Router();

ticketsRoutes.get("/", ticketsController.findAll);
ticketsRoutes.get("/:id", ticketsController.findById);
ticketsRoutes.post("/", ticketsController.create);
ticketsRoutes.put("/:id", ticketsController.update);
ticketsRoutes.delete("/:id", ticketsController.delete);

module.exports = ticketsRoutes;

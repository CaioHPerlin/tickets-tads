const express = require("express");
const ticketsController = require("../controller/tickets.controller");
const ticketsRoutes = express.Router();
const jwt = require("jsonwebtoken");

const jwtSecret = "devwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).send("Token não fornecido.");

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(500).send("falha ao autenticar o token.");
    req.userID = decoded.id;
    next();
  });
};

ticketsRoutes.get("/", verifyToken, ticketsController.findAll);
ticketsRoutes.get(
  "/user/:userID",
  verifyToken,
  ticketsController.findAllByUser
);
ticketsRoutes.get("/:id", verifyToken, ticketsController.findById);
ticketsRoutes.post("/", verifyToken, ticketsController.create);
ticketsRoutes.put("/:id", verifyToken, ticketsController.update);
ticketsRoutes.delete("/:id", verifyToken, ticketsController.delete);

module.exports = ticketsRoutes;

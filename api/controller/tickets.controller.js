const ticketModel = require("../models/ticket");
const { BadRequestError } = require("../utils/errors");

class TicketsController {
  async findAll(_, res, next) {
    try {
      const tickets = await ticketModel.findAll();
      res.status(200).json({ tickets });
    } catch (err) {
      next(err);
    }
  }

  async findAllByUser(req, res, next) {
    try {
      console.log(req.userID);
      const tickets = await ticketModel.findAllByUser(req.userID);
      res.status(200).json({ tickets });
    } catch (err) {
      next(err);
    }
  }

  async findById(req, res, next) {
    try {
      const ticket = await ticketModel.findById(req.params.id);
      res.status(200).json({ tickets: [ticket] });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new BadRequestError("'title' e 'description'  são obrigatórios.");
    }

    try {
      const openingDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Format: YYYY-MM-DD HH:MM:SS
      const newTicket = await ticketModel.create({
        title,
        description,
        openingDate,
        userID: req.userID,
      });
      res.status(201).json({ message: "Ticket criado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    const { title, description, resolved, openingDate, userID } = req.body;

    if (!title || !description || typeof resolved === "undefined" || !userID) {
      throw new BadRequestError(
        "'title', 'description', 'resolved' e 'userID' são obrigatórios."
      );
    }

    try {
      await ticketModel.update(req.params.id, {
        title,
        description,
        resolved,
        openingDate,
        userID,
      });
      res.status(200).json({ message: "Ticket atualizado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await ticketModel.delete(req.params.id);
      res.status(200).json({ message: "Ticket deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TicketsController();

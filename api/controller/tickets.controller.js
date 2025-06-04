const ticketModel = require("../models/ticket");
const { BadRequestError } = require("../utils/errors");
class TicketsController {
  async findAll(req, res, next) {
    try {
      const tickets = await ticketModel.findAll();
      res.status(200).render("tickets", { tickets });
    } catch (err) {
      next(err);
    }
  }

  async findById(req, res, next) {
    try {
      const ticket = await ticketModel.findById(req.params.id);
      res.status(200).render("tickets", { tickets: [ticket] });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new BadRequestError("'title' e 'description' são obrigatórios.");
    }

    try {
      const newTicket = await ticketModel.create({ title, description });
      res
        .status(201)
        .render("success", { message: "Ticket criado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    const { title, description, resolved } = req.body;

    if (!title || !description || typeof resolved === "undefined") {
      throw new BadRequestError(
        "'title', 'description' e 'resolved' são obrigatórios."
      );
    }

    try {
      await ticketModel.update(req.params.id, {
        title,
        description,
        resolved,
      });
      res
        .status(200)
        .render("success", { message: "Ticket atualizado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await ticketModel.delete(req.params.id);
      res
        .status(200)
        .render("success", { message: "Ticket deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TicketsController();

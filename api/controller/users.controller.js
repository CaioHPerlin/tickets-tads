const userModel = require("../models/user");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = "devwebtoken";

class UsersController {
  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email) {
      throw new BadRequestError("'email' é obrigatório.");
    }

    try {
      const user = await userModel.login(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedError("Senha inválida.");

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });

      res.status(200).json({ auth: true, token });
    } catch (err) {
      next(err);
    }
  }

  async findAll(req, res, next) {
    try {
      const users = await userModel.findAll();
      res.status(200).json({ users });
    } catch (err) {
      next(err);
    }
  }

  async findById(req, res, next) {
    try {
      const user = await userModel.findById(req.params.id);
      res.status(200).json({ users: [user] });
    } catch (err) {
      next(err);
    }
  }

  async findByEmail(req, res, next) {
    const { email } = req.params;

    if (!email) {
      throw new BadRequestError("'email' é obrigatório.");
    }

    try {
      const user = await userModel.findByEmail(email);
      res.status(200).json({ users: [user] });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError(
        "'name', 'email' e 'password' são obrigatórios."
      );
    }

    try {
      const newUser = await userModel.create({
        name,
        email,
        password: await bcrypt.hash(password, 8),
      });
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError(
        "'name', 'email' e 'password' são obrigatórios."
      );
    }

    try {
      await userModel.update(req.params.id, {
        name,
        email,
        password: bcrypt.hash(password, 8),
      });
      res.status(200).json({ message: "Usuário atualizado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await userModel.delete(req.params.id);
      res.status(200).json({ message: "Usuário deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();

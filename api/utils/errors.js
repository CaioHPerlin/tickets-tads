class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} não encontrado(a)`, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message || "Dados inválidos", 400);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  handleErrors: (err, _, res, __) => {
    console.error("[ERROR]", err);
    res
      .status(err.statusCode || 500)
      .render("error", { message: err.message || "Erro interno." });
  },
};

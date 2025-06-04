const connection = require("../connection");
const { NotFoundError, BadRequestError } = require("../utils/errors");

class Ticket {
  async findAll() {
    const [results] = await connection.promise().query(
      `SELECT id, title, description, openingDate, resolved 
       FROM tickets ORDER BY openingDate DESC`
    );
    return results;
  }

  async findById(id) {
    const [results] = await connection
      .promise()
      .query(`SELECT * FROM tickets WHERE id = ?`, [id]);

    if (results.length === 0) {
      throw new NotFoundError("Ticket");
    }
    return results[0];
  }

  async create({ title, description }) {
    const [result] = await connection.promise().query(
      `INSERT INTO tickets (title, description, openingDate, resolved) 
         VALUES (?, ?, CURRENT_DATE, FALSE)`,
      [title, description]
    );
    return this.findById(result.insertId);
  }

  async update(id, { title, description, resolved }) {
    await this.findById(id); // Verifica existência

    await connection.promise().query(
      `UPDATE tickets 
         SET title = ?, description = ?, resolved = ?
         WHERE id = ?`,
      [title, description, resolved, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    await this.findById(id); // Verifica existência
    await connection.promise().query(`DELETE FROM tickets WHERE id = ?`, [id]);
    return true;
  }
}

module.exports = new Ticket();

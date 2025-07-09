const connection = require("../connection");
const { NotFoundError, BadRequestError } = require("../utils/errors");

class Ticket {
  async findAll() {
    const [results] = await connection
      .promise()
      .query(`SELECT * FROM tickets ORDER BY openingDate DESC`);
    return results;
  }

  async findAllByUser(userID) {
    const [results] = await connection
      .promise()
      .query(
        `SELECT * FROM tickets WHERE userID = ? ORDER BY openingDate DESC`,
        [userID]
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

  async create({ title, description, openingDate, resolved, userID }) {
    const [result] = await connection.promise().query(
      `INSERT INTO tickets (title, description, openingDate, resolved, userID) 
         VALUES (?, ?, ?, ?, ?)`,
      [title, description, openingDate, resolved, userID]
    );
    return this.findById(result.insertId);
  }

  async update(id, { title, description, resolved, openingDate, userID }) {
    await this.findById(id); // Verifica existência

    await connection.promise().query(
      `UPDATE tickets 
         SET title = ?, description = ?, resolved = ?,
         openingDate = ?, userID = ?
         WHERE id = ?`,
      [title, description, resolved, openingDate, userID, id]
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

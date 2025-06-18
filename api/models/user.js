const connection = require("../connection");
const { NotFoundError, BadRequestError } = require("../utils/errors");

class User {
  async login(email) {
    const user = await this.findByEmail(email);
    return user;
  }

  async findAll() {
    const [results] = await connection
      .promise()
      .query(`SELECT id, name, email FROM users ORDER BY name ASC`);
    return results;
  }

  async findById(id) {
    const [results] = await connection
      .promise()
      .query(`SELECT id, name, email FROM users WHERE id = ?`, [id]);

    if (results.length === 0) {
      throw new NotFoundError("User");
    }
    return results[0];
  }

  async findByEmail(email) {
    const [results] = await connection
      .promise()
      .query(`SELECT * FROM users WHERE email = ?`, [email]);

    if (results.length === 0) {
      throw new NotFoundError("User");
    }
    return results[0];
  }

  async create({ name, email, password }) {
    // Check if email already exists
    try {
      await this.findByEmail(email);
      throw new BadRequestError("Email already in use");
    } catch (err) {
      if (!(err instanceof NotFoundError)) throw err;
    }

    const [result] = await connection.promise().query(
      `INSERT INTO users (name, email, password) 
       VALUES (?, ?, ?)`,
      [name, email, password]
    );
    return this.findById(result.insertId);
  }

  async update(id, { name, email, password }) {
    await this.findById(id); // Verify existence

    // Check if new email is already used by another user
    if (email) {
      try {
        const existingUser = await this.findByEmail(email);
        if (existingUser.id !== id) {
          throw new BadRequestError("Email already in use");
        }
      } catch (err) {
        if (!(err instanceof NotFoundError)) throw err;
      }
    }

    await connection.promise().query(
      `UPDATE users 
       SET name = ?, email = ?, password = ?
       WHERE id = ?`,
      [name, email, password, id]
    );

    return this.findById(id);
  }

  async delete(id) {
    await this.findById(id); // Verify existence
    await connection.promise().query(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  }
}

module.exports = new User();

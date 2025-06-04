class Tables {
  init(connection) {
    this.connection = connection;
    this.createTicketsTable();
  }

  createTicketsTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS tickets (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                openingDate DATE NOT NULL,
                resolved BOOLEAN NOT NULL
            );`;
    this.connection.query(query, (err) => {
      if (err) return console.error(err.message);
      console.info("[INFO] Db init OK");
    });
  }
}

module.exports = new Tables();

class Tables {
  init(connection) {
    this.connection = connection;
    this.createUsersTable();
    this.createTicketsTable();
  }

  createUsersTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            );`;
    this.connection.query(query, (err) => {
      if (err) return console.error(err);
      console.info("[INFO] Users init OK");
    });
  }

  createTicketsTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS tickets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                openingDate DATE NOT NULL,
                resolved BOOLEAN NOT NULL,
                userID INT,
                FOREIGN KEY (userID) REFERENCES users(id)
            );`;
    this.connection.query(query, (err) => {
      if (err) return console.error(err);
      console.info("[INFO] Tickets init OK");
    });
  }
}

module.exports = new Tables();

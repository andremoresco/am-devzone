const express = require("express");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
  password: "password",
});

const app = express();
app.use(express.json());

app.get("/clients", (req, res) => {
  pool.query("SELECT * FROM store.clients", (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else if (result) {
      res.status(200).json(result.rows);
    }
  });
});

app.get("/clients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(
    "SELECT * FROM store.clients WHERE id = $1",
    [id],
    (error, result) => {
      if (error) {
        res.status(500).end(error);
      } else {
        if (result?.rowCount == 0) {
          res.status(404).json({ message: "Client not found" });
        } else {
          res.status(200).json(result.rows[0]);
        }
      }
    }
  );
});

app.post("/clients", (req, res) => {
  const body = req.body;
  if (isClientValid(body)) {
    res.status(400).send({
      message:
        "Something went wrong. The fields `Name` and `Birthdate` are required.",
    });
  }

  pool.query(
    "INSERT INTO store.clients (name, birthdate) VALUES ($1, $2)",
    [body.name, body.birthdate],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(201).end();
      }
    }
  );
});

app.put("/clients/:id", (req, res) => {
  const clientId = parseInt(req.params.id);
  const body = req.body;

  if (isClientValid(body)) {
    res.status(400).send({
      message:
        "Something went wrong. The fields `Name` and `Birthdate` are required.",
    });
  }

  pool.query(
    "UPDATE store.clients SET name = $2, birthdate = $3 WHERE id = $1 RETURNING *",
    [clientId, body.name, body.birthdate],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        if (result.rowCount == 0) {
          res.status(404).json({ message: "Client not found" });
        } else {
          res.status(200).json(result.rows[0]);
        }
      }
    }
  );
});

app.delete("/clients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(
    "DELETE FROM store.clients WHERE id = $1",
    [id],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        console.log(result);
        if (result.rowCount == 0) {
          res.status(404).json({ message: "Client not found!" });
        } else {
          res.status(204).end();
        }
      }
    }
  );
});

const isClientValid = (client) => {
  if (client.name == null || client.name.trim() == "") {
    return false;
  }

  if (client.birthdate == null) {
    return false;
  }
};

app.listen(8080, () => console.log(`Server listenning or port 8080`));

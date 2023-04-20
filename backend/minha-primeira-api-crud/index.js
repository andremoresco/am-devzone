const express = require("express");

const app = express();
app.use(express.json());
`
Exemplo estrutura de cliente
{
  id: 1,
  name: "John",
  birthdate: "1990-05-07"
}
`;

let clients = [];

app.get("/clients", (req, res) => {
  res.json(clients);
});

app.get("/clients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const result = clients.find((client) => client.id === id);
  if (result != null) {
    res.json(result);
  } else {
    res.status(404).send();
  }
});

app.post("/clients", (req, res) => {
  const body = req.body;
  console.log(body);
  if (isClientValid(body)) {
    res.status(400).send({
      message:
        "Something went wrong. The fields `Name` and `Birthdate` are required.",
    });
  }

  clients.push(body);
  res.status(201).send();
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

  const foundIndex = clients.findIndex((client) => client.id === clientId);

  if (foundIndex > -1) {
    clients[foundIndex] = body;
    res.json(clients);
  } else {
    res.status(404).send();
  }
});

app.delete("/clients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const foundIndex = clients.findIndex((client) => client.id === id);

  if (foundIndex > -1) {
    console.log(foundIndex);
    clients.splice(foundIndex, 1);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
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

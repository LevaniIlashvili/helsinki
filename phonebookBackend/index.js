const express = require("express");

const app = express();

app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const phonebookEntries = persons.length;
  const date = new Date();
  response.send(`
        <div>
            <p>Phonebook has info for ${phonebookEntries} people</p>
            <p>${date}</p>
        </div>`);
});

app.use(express.json());

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    console.log("fields empty");
    return response.status(400).json({ error: "fields shouldn't be empty" });
  }

  if (persons.find((existingPerson) => existingPerson.name === person.name)) {
    console.log("name exists");
    return response.status(409).json({ error: "name must be unique" });
  }

  const id = Math.trunc(Math.random() * 10000000);

  const newPerson = {
    id,
    name: person.name,
    number: person.number,
  };

  persons.push(newPerson);
  response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
  console.log(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

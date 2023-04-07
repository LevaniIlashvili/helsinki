require("dotenv").config();
const express = require("express");
const Person = require("./model/person");

const app = express();

app.use(express.static("build"));
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  Person.count({}).then((count) => {
    const date = new Date();
    response.send(`
          <div>
              <p>Phonebook has info for ${count} people</p>
              <p>${date}</p>
          </div>`);
  });
});

app.post("/api/persons", (request, response, next) => {
  const person = request.body;

  if (!person.name || !person.number) {
    console.log("fields empty");
    return response.status(400).json({ error: "fields shouldn't be empty" });
  }

  Person.find({ name: person.name }).then((result) => {
    if (result.length > 0) {
      console.log("exists");
      return response.status(409).json({ error: "name must be unique" });
    } else {
      const newPerson = new Person({
        name: person.name,
        number: person.number,
      });
      newPerson
        .save()
        .then((result) => {
          response.json(newPerson);
        })
        .catch((error) => next(error));
    }
  });
});

app.put("/api/persons/:id", (request, response) => {
  Person.findByIdAndUpdate(
    request.params.id,
    {
      number: request.body.number,
    },
    { new: true }
  )
    .then((updatedNote) => {
      console.log(updatedNote);
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  response.status(204).end();
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

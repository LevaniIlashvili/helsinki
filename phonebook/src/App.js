import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import PersonNumbers from "./components/PersonNumbers";
import personService from "./services/persons";

function App() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  function handleNameChange(e) {
    console.log(e.target.value);
    setNewName(e.target.value);
  }

  function handleNumberChange(e) {
    console.log(e.target.value);
    setNewNumber(e.target.value);
  }

  function addNumber(e) {
    console.log(e);
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      const confirmEdit = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );

      if (confirmEdit) {
        const editedPerson = persons.find((person) => person.name === newName);
        personService
          .update(editedPerson.id, { ...editedPerson, number: newNumber })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== editedPerson.id ? person : returnedPerson
              )
            );
          });

        console.log("edit number");
        setNewName("");
        setNewNumber("");
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personService.create(newPerson).then((data) => {
        setPersons(persons.concat(data));
      });

      console.log("add number");
      setNewName("");
      setNewNumber("");
    }
  }

  const deleteNumber = (id) => {
    const person = persons.find((person) => person.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (confirmDelete) {
      personService.deleteObj(id);
      setPersons(persons.filter((person) => person.id !== id));
      console.log("delete number");
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <PersonForm
        onSubmit={addNumber}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PersonNumbers persons={persons} onDelete={deleteNumber} />
    </div>
  );
}

export default App;

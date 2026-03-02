import { useEffect, useState } from "react";
import axios from "axios";
import personsService from "./services/persons";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  // set persons array from server data before everything else
  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  console.log("render", persons.length, "persons/people");

  const addOrUpdatePerson = (event) => {
    event.preventDefault();

    // check do add or do update
    const existingPerson = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase(),
    );

    // ADD
    if (!existingPerson) {
      const personObject = {
        name: newName,
        number: newNumber,
        id: Math.floor(Math.random() * 10_000_000_000),
      };

      personsService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
      return;
    } else {
      // UPDATE, window confirm
      if (
        window.confirm(
          `${newName} is already in the phonebook. Replace the old number with a new one?`,
        )
      ) {
        // create an updated person object
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedPerson)
          .then((returnedP) => {
            setPersons(
              persons.map((p) => (p.id === returnedP.id ? returnedP : p)), // replace
            );
            setNewName("");
            setNewNumber("");
          });
      }
    }
  };

  const deletePersonByID = (event, id) => {
    event.preventDefault();
    const personToDelete = persons.find((p) => p.id === id);

    if (window.confirm(`delete "${personToDelete?.name}"?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== personToDelete.id));
        })
        .catch((error) => {
          alert(
            `the person '${personToDelete.name}' was already deleted from server`,
          );
          setPersons(persons.filter((n) => n.id !== id));
        });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleNameSearch = (event) => {
    console.log(event.target.value);
    setSearchName(event.target.value);
  };

  return (
    <div>
      <div>
        debug: {newName} {newNumber}
      </div>
      <h2>Phonebook</h2>

      <Filter
        onChange={handleNameSearch}
        persons={persons}
        searchName={searchName}
      />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addOrUpdatePerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <Person
            key={person.id}
            onDelete={() => deletePersonByID(event, person.id)}
            person={person}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;

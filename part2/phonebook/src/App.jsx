import { useEffect, useState } from "react";
import axios from "axios";
import personsService from "./services/persons";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [scsMessage, setScsMessage] = useState("");

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

      personsService.create(personObject).then((returnedP) => {
        setPersons(persons.concat(returnedP));
        setNewName("");
        setNewNumber("");
        // success message
        setScsMessage(`Added '${returnedP.name}'`);
        setTimeout(() => {
          setScsMessage(null);
        }, 5000);
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
        const updatedP = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedP)
          .then((returnedP) => {
            setPersons(
              persons.map((p) => (p.id === returnedP.id ? returnedP : p)), // replace
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setErrMessage(
              `Info of '${updatedP.name}' has already been removed from server`,
            );
            setTimeout(() => {
              setErrMessage(null);
            }, 5000);
            setPersons(persons.filter((n) => n.id !== updatedP.id));
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
            `Not found: the person '${personToDelete.name}' was already deleted from server`,
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
      <div>
        <Notification errMsg={errMessage} scsMsg={scsMessage} />
      </div>

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

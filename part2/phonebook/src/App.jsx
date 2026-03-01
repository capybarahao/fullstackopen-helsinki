import { useEffect, useState } from "react";
import axios from "axios";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get(" http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled!");
      setPersons(response.data);
    });
  }, []);
  console.log("render", persons.length, "persons/people");

  const addNewPerson = (event) => {
    event.preventDefault();

    // check if name already exist
    const nameAlreadyExists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (nameAlreadyExists) {
      alert(`"${newName}" is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
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
        onSubmit={addNewPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <Person key={person.name} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;

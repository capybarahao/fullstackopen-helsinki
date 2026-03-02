import Person from "./Person";

const Filter = ({ onChange, persons, searchName }) => {
  // for search filter
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().startsWith(searchName),
  );

  return (
    <>
      <div>
        <h3>search</h3>
        find: <input value={searchName} onChange={onChange} />
      </div>
      <div>
        {/* Show results only if there's actual search text (ignoring spaces) */}
        {searchName.trim() && (
          <ul>
            {personsToShow.map((person) => (
              <Person key={person.id} person={person} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Filter;

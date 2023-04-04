function PersonNumbers({ persons, onDelete }) {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
}

export default PersonNumbers;

const PhonebookData = ({persons, handleDelete}) => {
    return (
        <div>
            <h2>Entries:</h2>
            <ul>
                {persons.map((entry) => (
                    <li key={entry.id}>
                        {entry.name} {entry.number}
                        <button type="button" className="delete" onClick={handleDelete(entry.id, entry.name)}>x</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PhonebookData
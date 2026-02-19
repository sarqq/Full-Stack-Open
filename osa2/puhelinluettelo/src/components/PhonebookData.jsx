const PhonebookData = ({persons}) => {
    return (
        <div>
            <h2>Entries:</h2>
            <ul>
                {persons.map((entry, i) => (
                    <li key={i}>
                        {entry.name} {entry.number}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PhonebookData
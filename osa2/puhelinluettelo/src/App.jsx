import { useState } from 'react'
import './App.css'

const App = () => {
	// henkilötiedot
	const [persons, setPersons] = useState([])

	// lomakkeen kentät
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")

	// hakukenttä suodatusta varten
	const [query, setQuery] = useState("")

	// 2.6: henkilön lisäys puhelinluetteloon
	// 2.8: numeron lisäys henkilötietoihin
	const addEntry = (event) => {
   		event.preventDefault()

		// 2.7: olemassaolevan nimen tarkistus
		// henkilö on jo lisätty -> alert
		if (persons.some(p => p.name === newName)){
			alert(`${newName} is already added to phonebook`)
			return
		}
		else if (!newNumber) {
			alert("Missing phone number")
			return
		}

		// luodaan uusi nimi-numero-pari
		const newEntry = {
			name: newName,
			number: newNumber
		}

		// lisätään puhelinluetteloon
		setPersons(persons.concat(newEntry))
		setNewName("")
		setNewNumber("")
	}

	// käsittelijöitä
	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	// 2.9: nimen perusteella suodatus
	const filtered = persons.filter(person =>
		person.name.toLowerCase().includes(query.toLowerCase())
	)

	return (
		<div>
			<h1>Phonebook</h1>
			<div>
				<h2>Add new entry:</h2>
				<form onSubmit={addEntry}>
					<p>name: <input value={newName} onChange={handleNameChange}/></p>
					<p>number: <input value={newNumber} onChange={handleNumberChange}/></p>
					<button type="submit">add</button>
				</form>
			</div>

			<div>
				<h2>Search:</h2>
				<input type="search" value={query} onChange={(event) => setQuery(event.target.value)}/>
			</div>

			<div>
				<h2>Numbers</h2>
				<ul>
					{(filtered ? filtered : persons).map((entry, i) =>
						<li key={i}>{entry.name} {entry.number}</li>
					)}
				</ul>
			</div>
		</div>
	)
}

export default App

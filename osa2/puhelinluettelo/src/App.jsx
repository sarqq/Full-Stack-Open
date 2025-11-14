import { useState } from 'react'
import './App.css'

const App = () => {
	const [persons, setPersons] = useState([])

	// kontrolloi lomakkeen kenttiä
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")

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

	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	return (
   	<div>
      	<h1>Phonebook</h1>
			{/*TODO: 2.9: filtteröi nimellä*/}

			<h2>Add new entry:</h2>
			<form onSubmit={addEntry}>
				<p>name: <input value={newName} onChange={handleNameChange}/></p>
				<p>number: <input value={newNumber} onChange={handleNumberChange}/></p>
				<button type="submit">add</button>
			</form>

			<h2>Numbers</h2>
			<ul>
				{persons.map((person, i) =>
					<li key={i}>{person.name} {person.number}</li>
				)}
			</ul>
   </div>
  )
}

export default App

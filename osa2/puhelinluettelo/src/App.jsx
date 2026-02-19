import { useState } from 'react'
import './App.css'
import PhonebookData from './components/PhonebookData.jsx'
import Filter from './components/Filter.jsx'
import Form from './components/Form.jsx'

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
		// numero puuttuu -> alert
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

	// tapahtumakäsittelijät
	const handleNameChange = (event) => {
		console.log(event.target.value)
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	const handleQueryChange = (event) => {
		console.log(event.target.value)
		setQuery(event.target.value)
	}

	// 2.9: nimen perusteella suodatus
	const filtered = persons.filter(person =>
		person.name.toLowerCase().includes(query.toLowerCase())
	)

	return (
		<div>
			<h1>Phonebook</h1>
			<Form onSubmit={addEntry} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
			<Filter query={query} handleQueryChange={handleQueryChange}/>
			<PhonebookData persons={filtered}/>
		</div>
	)
}

export default App

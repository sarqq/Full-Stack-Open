import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import PhonebookData from './components/PhonebookData.jsx'
import Filter from './components/Filter.jsx'
import Form from './components/Form.jsx'

const BASE_URL= "http://localhost:3001/persons"

const App = () => {
	// henkilötiedot
	const [persons, setPersons] = useState([])

	// lomakkeen kentät
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")

	// hakukenttä suodatusta varten
	const [query, setQuery] = useState("")

	// 2.11: alkutilan haku palvelimelta
	useEffect(() => {
		axios.get(BASE_URL).then(response => {
			console.log("promise fulfilled")
			setPersons(response.data)
		})
	}, [])
	console.log("render", persons.length, "entries")

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
		
		// 2.12 lisätään uusi entry palvelimelle
		axios.post(BASE_URL, newEntry).then(response => {
			console.log(response)
			
			setPersons(persons.concat(response.data))
			setNewName("")
			setNewNumber("")
		})
		
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

import { useState, useEffect } from 'react'
import bookService from './services/entries.js'
import './App.css'
import PhonebookData from './components/PhonebookData.jsx'
import Filter from './components/Filter.jsx'
import Form from './components/Form.jsx'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")
	const [query, setQuery] = useState("")

	// 2.11: alkutilan haku palvelimelta
	useEffect(() => {
		bookService
			.getAll()
			.then(response => {
				console.log("promise fulfilled")
				setPersons(response.data)
			})
			.catch((error) => {
				console.log(error)
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

		// luodaan uusi entry
		const newEntry = {
			name: newName,
			number: newNumber
		}
		
		// 2.12: lisätään uusi entry palvelimelle
		bookService
			.create(newEntry)
			.then(response => { 
				setPersons(persons.concat(response.data))
				setNewName("")
				setNewNumber("")
			})
			.catch((error) => {
				console.log(error)
				setNewName("")
				setNewNumber("")
			})
	}

	// 2.14: henkilön poisto puhelinluettelosta
	const deleteEntry = (id, name) => {
		if(window.confirm(`Delete ${name}?`)) {
			bookService
				.delete(id)
				.then(() => {
					setPersons(persons.filter((person => person.id !== id)))
				})
				.catch((error) => {
					console.log(error)
				})
		}
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

	const handleDelete = (id, name) => event => {
		console.log(id, name)
		deleteEntry(id, name)
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
			<PhonebookData persons={filtered} handleDelete={handleDelete}/>
		</div>
	)
}

export default App

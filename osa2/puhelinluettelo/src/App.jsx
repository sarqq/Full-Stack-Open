import { useState, useEffect } from 'react'
import bookService from './services/entries.js'
import './App.css'
import PhonebookData from './components/PhonebookData.jsx'
import Filter from './components/Filter.jsx'
import Form from './components/Form.jsx'
import Alert from './components/Alert.jsx'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")
	const [query, setQuery] = useState("")
	const [msg, setMsg] = useState("")

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
				
				setMsg("Unknown server error :/")
				setTimeout(() => {
					setMsg(null)
				}, 3000)
			})
	}, [])
	console.log("render", persons.length, "entries")

	// 2.6: henkilön lisäys puhelinluetteloon
	// 2.8: numeron lisäys henkilötietoihin
	const addEntry = (event) => {
   		event.preventDefault()
		
		const newEntry = {
			name: newName,
			number: newNumber
		}

		// nimi tai numero puuttuu -> alert
		if (!newName || !newNumber){
			alert("Missing data!")
			return
		}

		// 2.7: olemassaolevan nimen tarkistus
		const target = persons.find((person) => person.name === newName)

		// 2.15: henkilö löytyy -> päivitys?
		if (target) {
			if(window.confirm(`${target.name} is already added to phonebook, replace the old number with a new one?`)){
				bookService
					.update(target.id, newEntry)
					.then((response) => {
						console.log(`updated ${target.name}`)
						setPersons(persons.map((person) => person.id !== target.id ? person : response))
						
						setMsg(`Updated ${target.name}`)
						setTimeout(() => {
							setMsg(null)
						}, 3000)
					})
					.catch((error) => {
						console.log(error)
						
						setMsg(`Could not update ${newName}`)
						setTimeout(() => {
							setMsg(null)
						}, 3000)
					})
			}
			setNewName("")
			setNewNumber("")
		}
		// 2.12: henkilö ei löydy -> lisätään uusi entry palvelimelle
		else{
			bookService
				.create(newEntry)
				.then(response => { 
					setPersons(persons.concat(response.data))

					setMsg(`Successfully added ${newName}`)
					setTimeout(() => {
						setMsg(null)
					}, 3000)
				})
				.catch((error) => {
					console.log(error)

					setMsg(`Could not add ${newName}`)
					setTimeout(() => {
						setMsg(null)
					}, 3000)
				})
			
			setNewName("")
			setNewNumber("")
		}
	}

	// 2.14: henkilön poisto puhelinluettelosta
	const deleteEntry = (id, name) => {
		const target = persons.find((person) => person.id === id)
		
		if (!target){
			alert(`Person ${name} not found!`)
			return
		}
		
		if(window.confirm(`Delete ${name}?`)) {
			bookService
				.delete(id)
				.then(() => {
					setPersons(persons.filter((person => person.id !== id)))

					setMsg(`Successfully deleted ${name}`)
					setTimeout(() => {
						setMsg(null)
					}, 3000)
				})
				.catch((error) => {
					console.log(error)
					
					setMsg(`Could not delete ${name}`)
					setTimeout(() => {
						setMsg(null)
					}, 3000)
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
			<Alert msg={msg}/>
			<Form onSubmit={addEntry} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
			<Filter query={query} handleQueryChange={handleQueryChange}/>
			<PhonebookData persons={filtered} handleDelete={handleDelete}/>
		</div>
	)
}

export default App

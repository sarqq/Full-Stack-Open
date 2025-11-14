import { useState } from 'react'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])

  // kontrolloi lomakkeen kenttää
  const [newName, setNewName] = useState("")

  const addName = (event) => {
    event.preventDefault()

    //TODO 2.5: lisää nimi luetteloon


    //TODO 2.6: estä duplikaatti -> alert
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value = {newName} onChange = {setNewName}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      TODO

      <div>debug: {newName}</div>
    </div>
  )
}

export default App

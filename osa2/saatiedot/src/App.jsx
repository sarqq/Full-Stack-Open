import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryData from './components/CountryData.jsx'
import './App.css'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

  // maatietojen haku
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/all`)
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // tulosten suodatus
  const display = filter
    ? countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    : []

  // tapahtumankäsittelijä
  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Weather data by country</h1>
      
      <div>
        <h2>Start by searching for countries:</h2>
        <input type="search" value={filter} onChange={handleFilter}/>
      </div>

      <ul>
        {display.length <= 10 && display.length > 1
        ? (display.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button>show</button>
          </li>
        ))
          )
        : display.length > 10
          ? <p>Too many matches, specify another filter.</p>
          : display.length === 1        
            ? <CountryData country={display[0]}/>
            : <p>Nothing to display.</p>
        }
      </ul>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryData from './components/CountryData.jsx'
import './App.css'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [display, setDisplay] = useState(null)

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
  const results = filter
    ? countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    : []

  // tapahtumankäsittelijät
  const handleFilter = (event) => {
    console.log(event.target.value)
    setDisplay(null)
    setFilter(event.target.value)
  }

  const handleShow = (country) => {
    console.log(country)
    setDisplay(country)
  }

  return (
    <div>
      <h1>Weather data by country</h1>
      
      <div>
        <h2>Start by searching for countries:</h2>
        <input type="search" value={filter} onChange={handleFilter}/>
      </div>

      <ul>
        {results.length <= 10 && results.length > 1
        ? (results.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button type="button" onClick={() => handleShow(country)}>show</button>
          </li>
        ))
          )
        : results.length > 10
          ? <p>Too many matches, specify another filter.</p>
          : results.length === 1        
            ? <CountryData country={results[0]}/>
            : <p>Nothing to display.</p>
        }
        {display && <CountryData country={display}/>}
      </ul>
    </div>
  )
}

export default App

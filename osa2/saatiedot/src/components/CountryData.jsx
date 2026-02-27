// yksittäinen maa
const CountryData = ({country}) => {
	return (
   	<div>
      	<h2>{country.name.common}</h2>
      	<p>
				Capital: {country.capital} <br/>
				Population: {country.population} <br/>
				Area: {country.area} <br/>
			</p>
          
			<h2>Languages</h2>
			<ul>
				{Object.values(country.languages).map((lang) => (
					<li key={lang}>{lang}</li>
				))}
			</ul>

			<h2>Flag</h2>
			<img src={country.flags.png} alt={country.name.common}/>
		</div>
	)
}

export default CountryData
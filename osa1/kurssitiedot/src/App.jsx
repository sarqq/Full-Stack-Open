import { Component, useState } from 'react'
import './App.css'

const Header = ({course}) => {
	console.log(course)
	return <h1>{course.name}</h1>
}

const Part = ({part}) => {
	console.log(part)
	return <p>{part.name} {part.ex}</p>
}

const Content = ({parts}) => {
	console.log(parts)
	return (
		<div>
			{parts.map((part, i) => (
				<Part key={i} part={part}/>
			))}
		</div>
	)
}

const Total = ({parts}) => {
	console.log(parts)
	const total = parts.reduce((sum, part) => sum + part.ex, 0);

	return <p>Number of exercises {total}</p>
}

const App = () => {
	const course = {
		name:'Half Stack application development',
		parts:[
			{name:'Fundamentals of React', ex:10},
			{name:'Using props to pass data', ex:7},
			{name:'State of a component', ex:14}
		]
	}

	return (
   	<div>
      	<Header course={course}/>
      	<Content parts={course.parts}/>
			<Total parts={course.parts}/>
   	</div>
  	)
}

export default App
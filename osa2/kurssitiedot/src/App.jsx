import { Component, useState } from 'react'
import './App.css'
import Course from './components/Course'

const App = () => {
	const courses = [
		{
			name:'Half Stack application development',
			id:1,
			parts:[
				{
					name:'Fundamentals of React',
					ex:10,
					id:1
				},
				{
					name:'Using props to pass data',
					ex:7,
					id:2
				},
				{
					name:'State of a component',
					ex:14,
					id:3
				},
			]
		},
		{
			name:'Node.js',
			id:2,
			parts:[
				{
					name:'Routing',
					ex:3,
					id:1
				},
				{
					name:'Middlewares',
					ex:7,
					id:2
				},
			]
		}
	]

	return (
		<div>
			{courses.map((course, id) => (
				<Course key={id} course={course}/>
			))}
		</div>
	)
}

export default App
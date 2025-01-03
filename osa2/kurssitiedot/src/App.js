import './App.js';

const Course = ({course}) => {
  console.log(course.name)
  return (
    <div>
      <Header header={course.name}/>
      <Content parts={course.parts}/>
    </div>
  )
}

const Header = (header) => {
  console.log(header)
  return <h1>{header.header}</h1>
}

const Content = (content) => {
  console.log(content.parts)
  return (
    <>
      <Part part={content.parts[0].name} exercises={content.parts[0].exercises}/>
      <Part part={content.parts[1].name} exercises={content.parts[1].exercises}/>
      <Part part={content.parts[2].name} exercises={content.parts[2].exercises}/>
    </>
  )
}

const Part = (part) => {
  return <p>{part.part} {part.exercises}</p>
}

const App = () => {
  const course = {
    name: "Half Stack application development",
    id: 1,
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3
      }
    ]
  }
  
  const total = course.parts.reduce((prev, curr) => 
    prev+curr.exercises, 0
  );

  return (
    <div>
      <Course course={course}/>
      Total of {total} exercises
    </div>
  )
}

export default App;

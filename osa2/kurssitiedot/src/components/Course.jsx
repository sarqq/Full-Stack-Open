//a component for a single course
//returns course name and modules
const Course = ({course}) => {
    console.log(course.name)
    
    return (
      <div>
        <Header header={course.name}/>
        <Content parts={course.parts}/>
        <strong>Total of {Total(course)} exercises</strong>
      </div>
    );
};
  
//site header, displays course name
const Header = ({header}) => {return <h1>{header}</h1>};
  
//course content
//returns data of all course modules
const Content = ({parts}) => {
    console.log(parts)
    
    return (
        <>
        {parts.map(part => (
            <Part key={part.id} part={part.name} exercises={part.exercises}/>
        ))}
        </>
    );
};
  
//module content
//returns module name and number of exercises
const Part = ({part, exercises}) => {
    console.log(part)
    return <p>{part} {exercises}</p>;
};
  
//function to return the total number of course exercises
function Total(props){
    return props.parts.reduce((prev, curr) => prev + curr.exercises, 0);
}

export default Course
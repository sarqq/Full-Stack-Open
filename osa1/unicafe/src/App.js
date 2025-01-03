import './App.js';
import {useState} from 'react'

const Statistics = (props) => {
  //checks if any feedback given
  if(props.value[0]>0 || props.value[1]>0 || props.value[2]>0){
    return(
      <table>
        <tr>
          <td>{props.name[0]}</td>
          <td>{props.value[0]}</td>
        </tr>
        <tr>
          <td>{props.name[1]}</td>
          <td>{props.value[1]}</td>
        </tr>
        <tr>
          <td>{props.name[2]}</td>
          <td>{props.value[2]}</td>
        </tr>
        <tr>
          <td>{props.name[3]}</td>
          <td>{props.value[3]}</td>
        </tr>
        <tr>
          <td>{props.name[4]}</td>
          <td>{props.value[4]}</td>
        </tr>
        <tr>
          <td>{props.name[5]}</td>
          <td>{props.value[5]}</td>
        </tr>
      </table>
    )
  }
  return (
    <div>
      No feedback given
    </div>
  )
}

const Button = (props) => {
  if(props.name==="good"){
    return (
      <button onClick={props.handler}>
        Good :)
      </button>
    )
  }
  else if(props.name==="bad"){
    return (
      <button onClick={props.handler}>
        Bad :(
      </button>
    )
  }
  else{
    return (
      <button onClick={props.handler}>
        Neutral :I
      </button>
    )
  }
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good+1)
    console.log("Positive feedback", good)
  }
  const handleNeutral = () => {
    setNeutral(neutral+1)
    console.log("Neutral feedback", neutral)
  }
  const handleBad = () => {
    setBad(bad+1)
    console.log("Negative feedback", bad)
  }

  return(
    <div>
      <h1>Give feedback! :^)</h1>
      <Button name="good" handler={handleGood}/>
      <Button name="neutral" handler={handleNeutral}/>
      <Button name="bad" handler={handleBad}/>
      <div>
        <h2>Statistics!</h2>
        <Statistics name={["good", "neutral", "bad", "all", "feedback average", "percentage of positive feedback"]}
         value={[good, neutral, bad, (good+neutral+bad), ((good-bad)/(good+neutral+bad)), [(good/(good+neutral+bad))*100, '%']]}/>
      </div>
    </div>
  )
}

export default App;

import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => {
    console.log('value good now', newValue)
    setGood(newValue)
  }

  const setToNeutral = newValue => {
    console.log('value neutral now', newValue)
    setNeutral(newValue)
  }

  const setToBad = newValue => {
    console.log('value bad now', newValue)
    setBad(newValue)
  }

  return (
    <div>
      <h1>give feedbacks</h1>
      <Button onClick={() => setToGood(good + 1)} text="good" />
      <Button onClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setToBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
    </div>
  )
}

export default App
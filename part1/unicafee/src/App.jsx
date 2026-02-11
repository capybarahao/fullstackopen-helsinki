import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <tbody>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  </tbody>
)

const Statistics = ({ good, neutral, bad, all }) => {
  if (all === 0) {
    return (
      <>
        <div>
          No feedback given
        </div>
      </>
    )
  }
  return (
    <table>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={(good * 1 + bad * (-1)) / all} />
      <StatisticLine text="positive" value={all === 0 ? '0%' : `${((good / all) * 100).toFixed(1)}%`} />
    </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let all = good + neutral + bad

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
    <>
      <h1>give feedbacks</h1>
      <Button onClick={() => setToGood(good + 1)} text="good" />
      <Button onClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setToBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </>
  )
}

export default App
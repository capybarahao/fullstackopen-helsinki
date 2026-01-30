const Header = (props) => {
  return (
    <h1>
      {props.name}
    </h1>
  )
}

const Content = (props) => {
  return (
    <div>
      <p>
        <Part text={props.text1} number={props.number1} />
        <Part text={props.text2} number={props.number2} />
        <Part text={props.text3} number={props.number3} />
      </p>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.text} <b>{props.number}</b>
      </p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
        Number of exercises <b>{props.sum}</b>
      </p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header name={course} />
      <Content text1={part1} number1={exercises1} text2={part2} number2={exercises2} text3={part3} number3={exercises3} />
      <br />
      <Total sum={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App
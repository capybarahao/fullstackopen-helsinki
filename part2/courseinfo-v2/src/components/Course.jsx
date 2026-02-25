const Courses = ({ courses }) => {

    return courses.map(course =>
        <Course course={course} />
    )
}

const Course = ({ course }) => {

    return (
        <>
            <h1>
                {course.name}
            </h1>
            <div>
                <table>
                    {course.parts.map(part =>
                        <StatisticLine part={part} />
                    )}
                </table>
            </div>

            <div>
                <b>total of <SumOfExescises parts={course.parts} /> exercises</b>
            </div>
        </>
    )
}

const StatisticLine = ({ part }) => (
    <tbody>
        <tr>
            <td>{part.name}</td>
            <td>{part.exercises}</td>
        </tr>
    </tbody>
)

const SumOfExescises = ({ parts }) => {
    const sumNum = parts.reduce((sum, part) => {
        return sum + part.exercises;
    }, 0

    );
    return sumNum;
}

export default Courses
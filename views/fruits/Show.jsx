const React = require("react")
const DefaultLayout = require("../DefaultLayout")

class Show extends React.Component {
  render() {
    const  { name, color, readyToEat } = this.props.fruit
    return (
      <DefaultLayout title={`${name} Show Page`}>
        <div>
            <p>The {name} is {color} </p>
            <br />
            {readyToEat ? "It is ready to eat!" : "It is not ready to eat .. don't touch that"}
        </div>
      </DefaultLayout>
    )
  } 
}

module.exports = Show

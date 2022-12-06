const React = require("react");
const DefaultLayout = require("../DefaultLayout");

class New extends React.Component {
  render() {
    const { fruits } = this.props
    return (
      <DefaultLayout title='New Fruit Page'>
        <nav>
          <a href='/fruits'>Home Page</a>
        </nav>

        <form action='/fruits' method='post'>
          <fieldset>
            <legend>Create a New Fruit</legend>
            <label>
              NAME:
              <input type='text' name='name' placeholder='enter fruit name' />
            </label>
            <label>
              COLOR:
              <input type='text' name='color' placeholder='enter fruit name' />
            </label>
            <label>
              {" "}
              READY TO EAT:
              <input type='checkbox' name='readyToEat' />{" "}
            </label>
          </fieldset>
          <input type='submit' value='create New fruit' />
        </form>
      </DefaultLayout>
    );
  }
}

module.exports = New;

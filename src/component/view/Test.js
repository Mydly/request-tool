import React from 'react';
import { connect } from 'react-redux';

class Test extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isGoing: true,
        numberOfGuests: 2
      };
  
      this.__handleInputChange = this.__handleInputChange.bind(this);
    }
  
    __handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      console.log(event.target.value);
  
      this.setState({
        [name]: value
      });
    }
  
    render() {
      return (
        <form>
          <label>
            Is going:
            <input
              name="isGoing"
              type="checkbox"
              checked={this.state.isGoing}
              onChange={this.__handleInputChange} />
          </label>
          <br />
          <label>
            Number of guests:
            <input
              name="numberOfGuests"
              type="number"
              value={this.state.numberOfGuests}
              onChange={this.__handleInputChange} />
          </label>
        </form>
      );
    }
  }

  function mapStateToProps(state) {
    
        return {
            tabBar: 3333
        };
    }
    
    const mapDispatchToProps = (dispatch) => {
        return {
            
        }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Test);
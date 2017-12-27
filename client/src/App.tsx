import * as React from 'react';
import './App.css';
import { Request } from './Helpers/Request';

class App extends React.Component {

    state = {currency: {name: 'Exalted Orb', value: 4, convertTo: 'chaos'}};

    componentDidMount() {
        const data: string = JSON.stringify({
            from: {
                name: this.state.currency.name,
                value: this.state.currency.value,
            },
            to: this.state.currency.convertTo
        });
        Request.fetchPostJson('/convertCurrency', data)
            .then((result) => {
                this.setState({
                    currency: result
                });
            });
    }

  render() {
    return (
      <div className="App">
        <p>
            Current currency is {this.state.currency.name} with value {Math.round(this.state.currency.value)}
        </p>
      </div>
    );
  }
}

export default App;

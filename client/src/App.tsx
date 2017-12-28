import * as React from 'react';
import './App.css';
import { Request } from './Helpers/Request';

class App extends React.Component {

    state = {latestId: ''};

    componentDidMount() {
        Request.fetchGetJson('/findLatestId')
            .then((result) => {
                const data = JSON.parse(result);
                this.setState({
                    latestId: data.id
                });
            });
    }

  render() {
    return (
      <div className="App">
          Latest id is {this.state.latestId}
      </div>
    );
  }
}

export default App;

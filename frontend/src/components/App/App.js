import '../../styles/index.css';

import React, { Component } from 'react';

import Navigation from '../Navigation/Navigation';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Navigation />
      </div>
    );
  }
}

export default App;

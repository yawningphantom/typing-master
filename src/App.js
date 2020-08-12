import React from 'react';
import logo from './logo.svg';
import './App.css';
import TypeScreen from './components/typeScreen';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2 style={{ marginTop: "0px" }}> Typing Master </h2>
        <TypeScreen />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;

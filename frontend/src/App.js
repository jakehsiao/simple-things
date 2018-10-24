import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { TodoListApp } from './Stateful';


class App extends Component {
  render() {
    return (
     <div>
       <TodoListApp />
     </div> 
    );
  }
}


export default App;

import './App.css';
import Board from './WhiteBoard/Board';
import React,{useState,useEffect} from 'react';


function App(props) {
  
  return (
    <div className="App">
      <div className='header'>
          <h2 className='heading'>WhiteBoard</h2>
      </div>
      <div className='body'>
      {
        <Board/>
      }
      </div>
    </div>
  );
}


export default App;

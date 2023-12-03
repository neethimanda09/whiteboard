import './Style.css';
import io from 'socket.io-client';
import React, {useRef, useEffect, useState} from 'react';

const Board = () => {
  
  //const socket = io('http://localhost:5000');
  
  const socket = io('https://whiteboardserver-ia2e.onrender.com');


  
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const [drawingData, setDrawingData] = useState([]);
 

  useEffect(() => {
    const canvas = canvasRef.current;
    const test = colorsRef.current;
    const context = canvas.getContext('2d');

    const colors = document.getElementsByClassName('color');
    console.log(colors, 'the colors');
    console.log(test);


    const current = {
      color: 'black',
    };

    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };

    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }

    
  let drawing = false;

  const draw = (x0, y0, x1, y1, color, emit) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    const w = canvas.width;
    const h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color,
    });
  };

  const onMouseDown = (e) => {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  };

  const onMouseMove = (e) => {
    if (!drawing) { return; }
    try{
      draw(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    }
    catch{}
  };

  const onMouseUp = (e) => {
    if (!drawing) { return; }
    drawing = false;
    try{
      draw(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
    }
    catch{}
  };

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      const time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 20), false);


  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 20), false);

  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', onResize, false);
  onResize();
  
  

  socket.on('init', (data) => {
   
      drawingData.forEach((item) => {
      const w = canvas.width;
      const h = canvas.height;
      draw(item.x0 * w, item.y0 * h, item.x1 * w, item.y1 * h, item.color);
    });
  });
  
  socket.on('drawing', (data) => {
    setDrawingData((prevData) => [...prevData, data]);
    const w = canvas.width;
    const h = canvas.height;
    draw(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  });



  return () => {
    
    socket.off('init');
    socket.off('drawing');

  };

  },[]);
 
    return(
      <div>
        <canvas ref={canvasRef} className="whiteboard" />

        <div ref={colorsRef} className="colors">
          <div className="color black" />
          <div className="color red" />
          <div className="color green" />
          <div className="color blue" />
          <div className="color yellow" />
        </div>

      </div>
    );
};
  
export default Board;
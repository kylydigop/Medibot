import React from 'react';
import { Fade, Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import "./PulsComp.css";



const gifImage = process.env.PUBLIC_URL + '/sample.gif'; // Import the GIF file

const PulsComp = ({
  aNIMATIONONHOWTOUSETHETEM,
  onGroupContainer1Click,
}) => {
  return (
    <div className="frame-parent8">
      <div className="vector-parent123">
        {/* Adjust the size of the GIF image */}
        <img src={gifImage} alt="sample.gif" style={{ width: '100px', height: '100px' }} />
        
        {/* Other content */}
        <img className="rectangle-icon" alt="" src="/rectangle-9.svg" />
        <h3 className="result-puls3">
          <p className="animation-on-how">{aNIMATIONONHOWTOUSETHETEM}</p>
          <p className="press-any-key">wew</p>
        </h3>
      </div>
      <div className="group-div" onClick={onGroupContainer1Click}>
        <div className="frame-child123" />
        <h1 className="start">START</h1>
      </div>
    </div>
  );
}

export default PulsComp;
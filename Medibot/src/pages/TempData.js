import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TempData.css";
import { PuffLoader } from "react-spinners";

const TempData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [temperatureCategory, setTemperatureCategory] = useState(null);

  useEffect(() => {
    setLoading(true);
    speak("Processing.... Please do not remove your finger while getting the result.");
    fetchTemperatureData(); 
  }, []);

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("http://192.168.137.10/tempdata");
      if (!response.ok) {
        throw new Error("Failed to fetch temperature data");
      }
      const data = await response.json();
      const tempAvg = parseFloat(data.tempAvg).toFixed(1); // Limit to one digit after the decimal point
      setTemperature(tempAvg);
      const category = getTemperatureCategory(tempAvg); // Determine temperature category
      setTemperatureCategory(category);
      setTimeout(() => {
        speak(`Your Vital Sign Result in Temperature is ${tempAvg} degree Celsius. ${category}`);
        setLoading(false);
      }, 8000);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      setLoading(false);
    }
  };

  const getTemperatureCategory = (temp) => {
    const temperatureValue = parseFloat(temp);
    if (temperatureValue < 35.9) {
      return "Lower than Normal";
    } else if (temperatureValue >= 36.0 && temperatureValue <= 37.0) {
      return "Normal";
    } else if (temperatureValue >= 37.1 && temperatureValue <= 38.0) {
      return "Higher than Normal";
    } else if (temperatureValue >= 38.1) {
      return "Fever";
    } else {
      return "Error Try Again.";
    }
  };

  const onGroupClick = useCallback(() => {
    speak("Thank you for using MediSation. Have a great day...");
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="temp-data-tpone">
      {loading ? (
        <div className="loader-container">
          <PuffLoader size={350} color={"#150da9"} loading={loading} />
          {loading && <span className="loading-text">PROCESSING</span>}
        </div>
      ) : (
        <>
          <div className="screen-14-tpone" />
          <section className="screen-21-tpone" />
          <header className="temp-data-child-tpone" />
          <div className="result-temp-parent-tpone">
            <b className="result-temp4-tpone">
              <p className="p1-tpone">{temperature} ℃</p> {/* Display temperature here */}
              <p className="normal2-tpone">{temperatureCategory}</p> {/* Display temperature category here */}
            </b>
            <div className="temp1-tpone">
              <div className="circle4-tpone" />
              <img
                className="thermometer-icon2-tpone"
                loading="lazy"
                alt=""
                src="/thermometer2.svg"
              />
              <h3 className="temperature2-tpone">Temperature</h3>
            </div>
          </div>
          <h1 className="vital-signs-result1-tpone">Vital Sign Result</h1>
          <img
            className="temp-data-item-tpone"
            loading="lazy"
            alt=""
            src="/vector-9.svg"
          />
          <img
            className="temp-data-inner-tpone"
            loading="lazy"
            alt=""
            src="/group-191.svg"
            onClick={onGroupClick}
          />
          <div className="done4-tpone">
            <p className="done5-tpone">DONE</p>
          </div>
          <img
            className="vector-icon5-tpone"
            loading="lazy"
            alt=""
            src="/about.svg"
          />
          <b className="about3-tpone">ABOUT</b>
          <b className="home3-tpone" onClick={onHOMETextClick}>
            HOME
          </b>
          <img
            className="home-2-streamline-coresvg-icon3-tpone"
            loading="lazy"
            alt=""
            src="/home2streamlinecoresvg1.svg"
          />
          <div className="group-div-tpone">
            <button className="speech-language-therapy3-tpone">
              <img
                className="logonew"
                alt=""
                src="/logonew.png"
              />
            </button>
            <h1 className="health-kiosk4-tpone">MediSation</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default TempData;

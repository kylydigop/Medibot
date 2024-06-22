import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TempData.css";
import { PuffLoader } from "react-spinners";

const TempData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState(null);
  const [temperatureCategory, setTemperatureCategory] = useState(null);
  const [spoken, setSpoken] = useState(false);

  useEffect(() => {
    speak("Processing.... Please do not remove your finger while getting the result.");
    setTimeout(() => {
      fetchTemperatureData();
    }, 10000); // Wait for 10 seconds before starting to fetch the temperature data
  }, []);

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("http://192.168.100.250/tempdata");
      if (!response.ok) {
        throw new Error("Failed to fetch temperature data");
      }
      const data = await response.json();
      const tempAvg = parseFloat(data.tempAvg).toFixed(1); // Limit to one digit after the decimal point
      setTemperature(tempAvg);
      const category = getTemperatureCategory(tempAvg); // Determine temperature category
      setTemperatureCategory(category);
      if (!spoken) {
        speak(`Your Vital Sign Result in Temperature is ${tempAvg} degree Celsius. ${category}`);
        setSpoken(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      setLoading(false);
    }
  };

  const getTemperatureCategory = (temp) => {
    const temperatureValue = parseFloat(temp);
    if (temperatureValue < 32.4) {
      return "Below Normal";
    } else if (temperatureValue >= 32.5 && temperatureValue <= 37.4) {
      return "Normal";
    } else if (temperatureValue >= 37.5 && temperatureValue <= 38.0) {
      return "Higher than Normal";
    } else if (temperatureValue >= 38.1 && temperatureValue <= 38.5) {
      return "Mild fever";
    } else if (temperatureValue >= 38.6 && temperatureValue <= 39.0) {
      return "Moderate fever";
    } else if (temperatureValue >= 39.2) {
      return "High Fever";
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
          <div className="home-container">
            <img
              className="home-2-streamline-coresvg-icon3-tpone"
              loading="lazy"
              alt="home icon"
              src="/home2streamlinecoresvg1.svg"
            />
            <b className="home3-tpone" onClick={onHOMETextClick}>
              HOME
            </b>
          </div>
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

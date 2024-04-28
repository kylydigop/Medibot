import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TempData.css";
import ClipLoader from "react-spinners/ClipLoader";
import { DotLoader, PuffLoader, RingLoader } from "react-spinners";

const TempData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  }, []);

  const onGroupClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="temp-data-tpone">
      {loading ? (
        <div className="loader-container">
        <PuffLoader size={350} color={"#150da9"}  loading={loading} />
        {loading && <span className="loading-text">PROCESSING</span>}
      </div>
      ) : (
        <>
          <div className="screen-14-tpone" />
          <section className="screen-21-tpone" />
          <header className="temp-data-child-tpone" />
          <div className="result-temp-parent-tpone">
            <b className="result-temp4-tpone">
              <p className="p1-tpone">32.0 ℃</p>
              <p className="normal2-tpone">Normal</p>
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
                className="logomedisation-2-icon3-tpone"
                alt=""
                src="/logomedisation-1@2x.png"
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

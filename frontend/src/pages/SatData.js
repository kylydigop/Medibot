import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FrameComponent2 from "../components/FrameComponent2";
import "./SatData.css";
import { ClipLoader, DotLoader } from "react-spinners";

const SaturationData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ spo2: null, pulse: null });

  useEffect(() => {
    setLoading(true);

    // Fetch the data from the specified IP
    fetch("http://10.42.0.250/poxdata")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the JSON data contains keys "SpO2" and "BPM"
        setData({
          spo2: data.SpO2, // Oxygen saturation data (SpO2)
          pulse: data.BPM,  // Pulse rate data (BPM)
        });
        setLoading(false);

        // Announce the results via text-to-speech
        speak(`Your Vital Sign Result is SpO2 ${data.SpO2}% and Pulse Rate is ${data.BPM} beats per minute.`);
      })
      .catch((error) => {
        console.error("Error fetching the data:", error);
        setLoading(false);
      });

    // Initial voice message
    speak("Processing.... Please do not remove your finger while getting the result.");
  }, []);

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onGroup1Click = useCallback(() => {
    speak("Thank you for using MediSation. Have a great day...");
    navigate("/");
  }, [navigate]);

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.6;
    utterance.volume = 1;
    utterance.rate = 0.6;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="saturation-data">
      {loading ? (
        <div className="loader-scontainer1">
          <DotLoader size={350} color={"#eee518"} loading={loading} />
          {loading && <span className="loading-text1">PROCESSING</span>}
        </div>
      ) : (
        <>
          <div className="screen-13" />
          <section className="screen-21" />
          <img
            className="saturation-data-child"
            loading="lazy"
            alt=""
            src="/vector-9.svg"
          />
          <FrameComponent2
            onHome2StreamlineCoresvgClick={onHome2StreamlineCoresvgClick}
            onHOMETextClick={onHOMETextClick}
          />
          <section className="saturation-data-inner">
            <div className="frame-div">
              <div className="vital-signs-result-wrapper">
                <h1 className="vital-signs-result1">VITAL SIGN RESULT</h1>
              </div>
              <div className="frame-parent1">
                <div className="saturation-subtract-parent">
                  <div className="saturation-subtract">
                    <div className="o-o-sat">
                      <div className="o-o-sat-sub">
                        <div className="circle5" />
                        <img
                          className="o-o-sat-sub-child"
                          loading="lazy"
                          alt=""
                          src="/spo2.png"
                        />
                      </div>
                    </div>
                    <div className="result-temp-wrapper">
                      <h1 className="result-temp1">
                        <p className="p1">Oxygen level</p>
                        {data.spo2 !== null ? <p>{data.spo2}%</p> : <p> Loading</p>}
                      </h1>
                    </div>
                  </div>
                  <div className="saturation-subtract1">
                    <div className="o2-sat-parent">
                      <img
                        className="subtract-icon"
                        loading="lazy"
                        alt=""
                        src="/pulso.png"
                      />
                      <div className="pr-bpm-wrapper">
                        <h3 className="pr-bpm"></h3>
                      </div>
                    </div>
                    <div className="result-temp-container">
                      <h1 className="result-temp2">
                        <p className="hb">Pulse rate</p>
                        {data.pulse !== null ? <p>{data.pulse} BPM</p> : <p> Loading</p>}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="frame-parent2">
                  <div className="frame-wrapper1">
                    <img
                      className="frame-item"
                      loading="lazy"
                      alt=""
                      src="/done1.png"
                      onClick={onGroup1Click}
                    />
                  </div>
                  <div className="done2"></div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SaturationData;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FrameComponent2 from "../components/FrameComponent2";
import "./SatData.css";


import { ClipLoader, DotLoader } from "react-spinners";

const SaturationData = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  }, []);

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onGroup1Click = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
                <h1 className="vital-signs-result1">Vital Sign Result</h1>
              </div>
              <div className="frame-parent1">
                <div className="saturation-subtract-parent">
                  <div className="saturation-subtract">
                    <div className="o-o-sat">
                      <b className="o22">% Sp02</b>
                      <div className="o-o-sat-sub">
                        <div className="circle5" />
                        <img
                          className="o-o-sat-sub-child"
                          loading="lazy"
                          alt=""
                          src="/group-211.svg"
                        />
                      </div>
                    </div>
                    <div className="result-temp-wrapper">
                      <h1 className="result-temp1">
                        <p className="p1">95 %</p>
                        <p className="normal1">Normal</p>
                      </h1>
                    </div>
                  </div>
                  <div className="saturation-subtract1">
                    <div className="o2-sat-parent">
                      <img
                        className="o2-sat-icon"
                        alt=""
                        src="/o2-sat.svg"
                      />
                      <img
                        className="subtract-icon"
                        loading="lazy"
                        alt=""
                        src="/subtract.svg"
                      />
                      <div className="pr-bpm-wrapper">
                        <h3 className="pr-bpm">
                          <b>{`PR `}</b>
                          <span>bPm</span>
                        </h3>
                      </div>
                    </div>
                    <div className="result-temp-container">
                      <h1 className="result-temp2">
                        <p className="hb">78 HB</p>
                        <p className="normal2">Normal</p>
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
                      src="/group-191.svg"
                      onClick={onGroup1Click}
                    />
                  </div>
                  <div className="done2">
                    <p className="done3">DONE</p>
                  </div>
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

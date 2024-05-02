import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectionThree.css";

const SelectionThree = () => {
  const navigate = useNavigate();

  const onGroupClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="selectionthree">
      <div className="screen-14" />
      <img className="screen-2-icon2" alt="" src="/screen-2.svg" />
      <section className="frame-section">
        <img className="frame-inner" alt="" src="/group-29.svg" />
        <img
          className="group-icon"
          loading="lazy"
          alt=""
          src="/group-191.svg"
          onClick={onGroupClick}
        />
      </section>
      <div className="done4">
        <p className="done5">DONE</p>
      </div>
      <section className="rectangle-parent">
        <div className="rectangle-div" />
        <div className="speech-language-therapy-parent">
          <button className="speech-language-therapy">
            <img
              className="logonew"
              alt=""
              src="/logonew.png"
              onClick={onHome2StreamlineCoresvgClick}
            />
          </button>
          <div className="health-kiosk-wrapper">
            <h1 className="health-kiosk"onClick={onHome2StreamlineCoresvgClick}>MediSation</h1>
          </div>
        </div>
        <div className="frame-wrapper2">
          <div className="frame-parent3">
            <div className="home-2-streamline-coresvg-wrapper">
              <img
                className="home-2-streamline-coresvg-icon"
                loading="lazy"
                alt=""
                src="/home2streamlinecoresvg.svg"
                onClick={onHome2StreamlineCoresvgClick}
              />
            </div>
            <div className="home-wrapper">
              <b className="home" onClick={onHOMETextClick}>
                HOME
              </b>
            </div>
            <img
              className="about-icon"
              loading="lazy"
              alt=""
              src="/about.svg"
            />
            <div className="about-wrapper">
              <b className="about">ABOUT</b>
            </div>
          </div>
        </div>
      </section>
      <section className="frame-parent4">
        <div className="frame-parent5">
          <button className="rectangle-group">
            <div className="frame-child1" />
            <b className="medibot-assistant">MediBOT Assistant</b>
          </button>
          <div className="send-medibot-a-message-wrapper">
            <i className="send-medibot-a">send MediBot a message...</i>
          </div>
        </div>
        <div className="frame-wrapper3">
          <div className="rectangle-container">
            <div className="frame-child2" />
            <div className="micbtn">
              <img className="micbtn-child" alt="" src="/ellipse-7.svg" />
              <div className="stopped">stopped</div>
              <img
                className="vector-icon"
                loading="lazy"
                alt=""
                src="/vector2.svg"
              />
              <img className="vector-icon1" alt="" src="/vector-1.svg" />
              <img className="vector-icon2" alt="" src="/vector-2.svg" />
              <img className="function-x-icon" alt="" src="/vector-3.svg" />
              <img className="vector-icon3" alt="" src="/vector-4.svg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectionThree;

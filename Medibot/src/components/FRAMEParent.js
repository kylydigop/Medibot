import "./FRAMEParent.css";

const FRAMEParent = () => {

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const onAboutParentClick = () => {
    speak("Medi Sation is an innovative health companion.. designed to facilitate health measurement, monitor individual vital signs, and answering medical FAQs.. ");
    // SPEAK WHEN CLICK ABOUT SVG
  };

  return (
    <section className="f-r-a-m-e-parent">
      <div className="f-r-a-m-e-parent-child" />
      <div className="speech-language-therapy-group">
        <button className="speech-language-therapy1">
          <img
            className="logonew"
            alt=""
            src="/logonew.png"
          />
          <img className="vector-icon4" alt="" src="/vector.svg" />
        </button>
        <div className="health-kiosk-container">
          <h1 className="health-kiosk1">MediSation</h1>
        </div>
      </div>
      <div className="f-r-a-m-e-parent-inner">
        <div className="about-parent" onClick={onAboutParentClick}>
          <img className="about-icon1" loading="lazy" alt="" src="/about.svg" />
          <div className="about-container">
            <b className="about1">ABOUT</b>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FRAMEParent;
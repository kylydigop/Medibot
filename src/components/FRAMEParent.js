import "./FRAMEParent.css";

const FRAMEParent = () => {
  return (
    <section className="f-r-a-m-e-parent">
      <div className="f-r-a-m-e-parent-child" />
      <div className="speech-language-therapy-group">
        <button className="speech-language-therapy1">
          <img
            className="logomedisation-1-icon"
            alt=""
            src="/logomedisation-1@2x.png"
          />
          <img className="vector-icon4" alt="" src="/vector.svg" />
        </button>
        <div className="health-kiosk-container">
          <h1 className="health-kiosk1">MediSation</h1>
        </div>
      </div>
      <div className="f-r-a-m-e-parent-inner">
        <div className="about-parent">
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

import "./FrameComponent2.css";

const FrameComponent2 = ({
  onHome2StreamlineCoresvgClick,
  onHOMETextClick,
}) => {
  return (
    <section className="rectangle-parent1-sat">
      <header className="rectangle-header-sat" />
      <div className="speech-language-therapy-parent1-sat">
        <button className="speech-language-therapy3-sat">
        <img
                className="logonew"
                alt=""
                src="/logonew.png"
              />
        </button>
        <div className="health-kiosk-frame-sat">
          <h1 className="health-kiosk3-sat">MediSation</h1>
        </div>
      </div>
      <div className="frame-wrapper5-sat">
        <div className="frame-parent8-sat">
          <div className="home-2-streamline-coresvg-frame-sat">
            <img
              className="home-2-streamline-coresvg-icon2-sat"
              loading="lazy"
              alt=""
              src="/home2streamlinecoresvg1.svg"
              onClick={onHome2StreamlineCoresvgClick}
            />
          </div>
          <div className="home-container-sat">
            <b className="home1-sat" onClick={onHOMETextClick}>
              HOME
            </b>
          </div>
          <img
            className="vector-icon5-sat"
            loading="lazy"
            alt=""
            src="/about.svg"
          />
          <div className="about-frame-sat">
            <b className="about3-sat">ABOUT</b>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent2;
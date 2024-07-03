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
            src="/logo2.png"
          />
        </button>
        <div className="health-kiosk-frame-sat">
          <h1 className="health-kiosk3-sat">MediSation</h1>
        </div>
      </div>
      <div className="frame-wrapper5-sat">
        <div className="frame-parent8-sat">
          <div className="home-container-sat" onClick={onHome2StreamlineCoresvgClick}>
            <img
              className="home-2-streamline-coresvg-icon2-sat"
              loading="lazy"
              alt="home icon"
              src="/home2streamlinecoresvg1.svg"
            />
            <b className="home1-sat" onClick={onHOMETextClick}>
              HOME
            </b>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent2;

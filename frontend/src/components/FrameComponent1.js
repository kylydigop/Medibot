import "./FrameComponent1.css";

const FrameComponent1 = ({
  onHome2StreamlineCoresvgClick,
  onHOMETextClick,
}) => {
  return (
    <header className="frame-header">
      <div className="frame-child3" />
      <div className="speech-language-therapy-container">
        <button className="speech-language-therapy2">
          <img
            className="logonew"
            alt=""
            src="/logo2.png"
            onClick={onHome2StreamlineCoresvgClick}
          />
        </button>
        <div className="health-kiosk-title">
          <h1 className="health-kiosk2" onClick={onHOMETextClick}>MediSation</h1>
        </div>
      </div>
    </header>
  );
};

export default FrameComponent1;

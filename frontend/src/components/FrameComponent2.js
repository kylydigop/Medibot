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
          <h1 className="health-kiosk3-sat"onClick={onHome2StreamlineCoresvgClick}>MediSation</h1>
        </div>    
      </div>
    </section>
  );
};

export default FrameComponent2;

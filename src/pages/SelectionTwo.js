import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FrameComponent1 from "../components/FrameComponent1";
import "./SelectionTwo.css";
import PulsComp from "../components/PulsComp";

const SelectionTwo = () => {
  const navigate = useNavigate();

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onGroupContainer1Click = useCallback(() => {
    navigate("/sat-data");
  }, [navigate]);

  const onGroupImage1Click = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="selectiontwo">
      <div className="screen-12" />
      <img className="screen-2-icon1" alt="" src="/screen-2.svg" />
      <FrameComponent1 
      onHome2StreamlineCoresvgClick={onHome2StreamlineCoresvgClick}
      onHOMETextClick={onHOMETextClick}
      />
      <img className="selectiontwo-child" alt="" src="/group-21@2x.png" />
      <section className="selectiontwo-inner">
        <div className="frame-container">
          <div className="oval-shape-wrapper">
            <div className="oval-shape">
              <div className="parent-circle-wrapper">
                <div className="parent-circle">
                  <div className="o21">Pulse Oximeter</div>
                  <div className="circle-shape">
                    <div className="circle4" />
                    <img
                      className="pulse-icon"
                      loading="lazy"
                      alt=""
                      src="/pulse.svg"
                    />
                  </div>
                </div>
              </div>
              <img
                className="oval-shape-child"
                loading="lazy"
                alt=""
                src="/group-192@2x.png"
                onClick={onGroupImage1Click}
              />
            </div>
          </div>
          <PulsComp
            aNIMATIONONHOWTOUSETHETEM="ANIMATION ON HOW TO USE THE PULSE OXIMETER WITH VOICE "
            onGroupContainer1Click={onGroupContainer1Click}
          />
        </div>
      </section>
    </div>
  );
};

export default SelectionTwo;

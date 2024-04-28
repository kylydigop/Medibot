import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FrameComponent1 from "../components/FrameComponent1";
import TempComp from "../components/TempComp";
import "./SelectionOne.css";

const SelectionOne = () => {
  const navigate = useNavigate();

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onGroupContainer1Click = useCallback(() => {
    navigate("/temp-data");
  }, [navigate]);

  const onGroupImageClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

 
  return (
    <div className="selectionone">
      <div className="screen-1" />
      <img className="screen-2-icon" alt="" src="/screen-2.svg" />
      <FrameComponent1
        onHome2StreamlineCoresvgClick={onHome2StreamlineCoresvgClick}
        onHOMETextClick={onHOMETextClick}
      />
      <section className="result-temp-label-wrapper">
        <div className="result-temp-label">
          <div className="f-r-a-m-e-wrapper">
            <div className="f-r-a-m-e">
              <div className="circle-symbol-wrapper">
                <div className="circle-symbol1">
                  <div className="circle-parent">
                    <div className="circle1" />
                    <img
                      className="thermometer-icon1"
                      loading="lazy"
                      alt=""
                      src="/thermometer1.svg"
                    />
                  </div>
                  <div className="temperature1">Temperature</div>
                </div>
              </div>
              <img
                className="f-r-a-m-e-child"
                loading="lazy"
                alt=""
                src="/group-19@2x.png"
                onClick={onGroupImageClick}
              />
            </div>
          </div>
          <TempComp
            aNIMATIONONHOWTOUSETHETEM="ANIMATION ON HOW TO USE THE TEMPERATURE WITH VOICE "
            onGroupContainer1Click={onGroupContainer1Click}
          />
        </div>
      </section>
    </div>
  );
};

export default SelectionOne;

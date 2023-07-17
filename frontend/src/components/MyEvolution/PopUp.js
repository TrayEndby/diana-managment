import React, { useState } from "react";
import './style.scss';
import questionMark from "../../assets/myEvolution/question.png"
import keyboard from "../../assets/myEvolution/Keyboard.png"
import mouse from "../../assets/myEvolution/Mouse.png"
import line from "../../assets/myEvolution/Line.png"


const PopUp = () => {

  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="question-mark"
        onClick={() => setOpen(!open)}
        data-toggle="modal">
        <img src={questionMark} alt="question-mark" />
      </div>
      {open && (
        <div
          className="modal pop-up"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <p className="navigation-text">Navigate through the page:</p>
          <img src={keyboard} alt="keyboard" className="keyboard" />
          <img src={line} alt="line" className="line" />
          <img src={mouse} alt="mouse" className="mouse" />
        </div>)}
    </div >
  );
};

export default PopUp;
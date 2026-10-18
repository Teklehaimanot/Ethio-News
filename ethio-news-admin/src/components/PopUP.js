import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const PopUP = () => {
  <Popup trigger={<button> Click to open modal </button>} modal nested>
    {(close) => (
      <div className="modal">
        <div className="content">Welcome to GFG!!!</div>
        <div>
          <button onClick={() => close()}>Close modal</button>
        </div>
      </div>
    )}
  </Popup>;
};

export default PopUP;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import "./Spinner.css";
function Spinner() {
  return (
    <div className="spin">
      <FontAwesomeIcon icon={faCircleNotch} />
    </div>
  );
}

export default Spinner;

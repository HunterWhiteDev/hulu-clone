import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./Nav.css";
function Nav() {
  const [show, handleShow] = useState(false);
  const history = useHistory();
  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
      console.log("test");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => {
      window.removeEventListener("scroll", transitionNavBar);
    };
  }, []);

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <div className="nav__contentsLeft">
          <img
            className="nav__logo"
            src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Hulu_logo_%282018%29.svg"
            alt=""
            onClick={() => history.push("/")}
          />

          <button
            onClick={() => history.push("my-list")}
            className="nav__myList"
          >
            My List
          </button>
        </div>

        <img
          onClick={() => history.push("/profile")}
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt=""
        />
      </div>
    </div>
  );
}

export default Nav;

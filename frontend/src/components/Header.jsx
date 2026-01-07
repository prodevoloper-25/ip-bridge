import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick(path) {
    navigate(path);
  }

  return (
    <header className="heading">
    <nav>
      <h3
        style={{
          fontWeight: location.pathname === "/" ? "bolder" : "50",
        }}
        onClick={() => handleClick("/")}
      >
        Home
      </h3>
      <h3
        style={{
          fontWeight: location.pathname === "/about" ? "bolder" : "50",
        }}
        onClick={() => handleClick("/about")}
      >
        About
      </h3>

      <h3
        style={{
          fontWeight: location.pathname === "/signup" ? "bolder" : "50",
        }}
        onClick={() => handleClick("/signup")}
      >
        Signup
      </h3>

      <h3
        style={{
          fontWeight: location.pathname === "/login" ? "bolder" : "50",
        }}
        onClick={() => handleClick("/login")}
      >
        Login
      </h3>
     
    </nav>
    </header>
  );
}

export default Header;

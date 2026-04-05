
import React, { useState, useEffect } from 'react';
import './Nav.css';


function Nav({ onSearch}) {
  const [show, handleShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const transitionNavBar = () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else {
        handleShow(false);
      }
    };

    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <h1 className="nav__logo">Nutflix</h1>

      <div className="nav__searchContainer">
        <input
          className="nav__searchInput"
          type="text"
          placeholder="Titles, people, genres"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default Nav;
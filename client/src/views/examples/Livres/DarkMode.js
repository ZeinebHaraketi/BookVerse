import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const DarkModeToggle = ({ darkMode, onToggleDarkMode }) => {
  return (
    <div className="dark-mode-toggle">
      <button onClick={onToggleDarkMode} className="dark-mode-button">
        {darkMode ? (
          <FontAwesomeIcon icon={faSun} className="sun-icon" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="moon-icon" />
        )}
      </button>
    </div>
  );
};

export default DarkModeToggle;

import React, { useContext, useRef } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "@/styles/Navbar.module.css";
import { ThemeContext } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const themeToggle = useRef(null);
  const { mode, changeMode } = useContext(ThemeContext);

  const isDarkTheme = mode === "dark";
  const themeSwitcherClassName = `${styles.theme__switcher} ${
    isDarkTheme ? styles.checked : ""
  }`;

  const handleToggle = () => {
    changeMode(isDarkTheme ? "light" : "dark");
  };

  return (
    <div className={`${themeSwitcherClassName} mobile__hide`}>
      <input
        ref={themeToggle}
        onChange={handleToggle}
        type="checkbox"
        id="switch"
        checked={isDarkTheme}
      />
      <label htmlFor="switch">
        <FaSun className={styles.fa_sun} />
        <FaMoon className={styles.fa_moon} />
        <span className={styles.ball}></span>
      </label>
    </div>
  );
}

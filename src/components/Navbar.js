import Logo from "../../public/media/logo.svg";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { FaSun, FaMoon } from "react-icons/fa";
import Search from "./Search";
import Dropdown from "./Dropdown";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const options = [
  { label: "Default styles", value: "default" },
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Mono", value: "mono" },
  { label: "Serif", value: "serif" },
];

export default function Navbar() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const themeToggle = useRef(null);

  const { changeMode, mode } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    isLoaded &&
      localStorage.setItem("isDarkTheme", JSON.stringify(isDarkTheme));
  }, [isLoaded, isDarkTheme]);

  useEffect(() => {
    setIsLoaded(true);
    // Retrieve the stored checkbox state from the local storage
    const storedTheme = localStorage.getItem("isDarkTheme");
    if (storedTheme) {
      setIsDarkTheme(JSON.parse(storedTheme));
    }
  }, []);

  const handleToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    changeMode(mode === "light" ? "dark" : "light");
  };

  // Add the 'checked' class dynamically based on isDarkTheme state
  const themeSwitcherClassName = `${styles.theme__switcher} ${
    isDarkTheme ? styles.checked : ""
  }`;

  return (
    <nav className={`${styles.nav__component} `}>
      <Link className={styles.logo__container} href="/">
        <Image src={Logo} alt="Logo img" width={30} height={30} />
      </Link>
      <Search />
      {/* <Dropdown options={options} onSelect={handleSelect} /> */}
      <Dropdown options={options} />

      <div className={themeSwitcherClassName}>
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
    </nav>
  );
}

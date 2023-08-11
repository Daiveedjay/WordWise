import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Dropdown.module.css";
import { useFont } from "@/hooks/useFont";

const Dropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const dropdownRef = useRef(null);

  const { font, changeFont } = useFont();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    // onSelect(option);
    setIsOpen(false);
    changeFont(option.value);
  };

  return (
    <div className={`${styles.dropdown} tablet__hide`} ref={dropdownRef}>
      <p className={styles.dropdown__toggle} onClick={handleToggle}>
        {selectedOption.label}
      </p>
      {isOpen && (
        <div className={styles.dropdown__menu}>
          {options.map((option) => (
            <p
              key={option.value}
              className={styles.dropdown__item}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

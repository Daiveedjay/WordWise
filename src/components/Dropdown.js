// import { useState, useRef, useEffect } from "react";
// import styles from "@/styles/Dropdown.module.css";
// import { useFont } from "@/hooks/useFont";

// const Dropdown = () => {
//   const options = [
//     { label: "Default styles", value: "default" },
//     { label: "Sans-serif", value: "sans-serif" },
//     { label: "Mono", value: "mono" },
//     { label: "Serif", value: "serif" },
//   ];
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(options[0]);

//   const dropdownRef = useRef(null);

//   const { changeFont } = useFont();

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, []);

//   const handleToggle = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSelect = (option) => {
//     setSelectedOption(option);

//     setIsOpen(false);
//     changeFont(option.value);
//   };

//   return (
//     <div className={`${styles.dropdown} tablet__hide`} ref={dropdownRef}>
//       <p className={styles.dropdown__toggle} onClick={handleToggle}>
//         {selectedOption.label}
//       </p>
//       {isOpen && (
//         <div className={styles.dropdown__menu}>
//           {options.map((option) => (
//             <p
//               key={option.value}
//               className={styles.dropdown__item}
//               onClick={() => handleSelect(option)}
//             >
//               {option.label}
//             </p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dropdown;

import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/Dropdown.module.css";
import { useFont } from "@/hooks/useFont";

const options = [
  { label: "Default styles", value: "default" },
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Mono", value: "mono" },
  { label: "Serif", value: "serif" },
];
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const dropdownRef = useRef(null);

  const { changeFont, font } = useFont();

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === font));
  }, [font]);

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

    setIsOpen(false);
    changeFont(option.value);
  };

  useEffect(() => {
    if (font) {
      document.body.classList.remove("sans-serif", "mono", "serif");
      document.body.classList.add(font);
    }
  }, [font]);

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

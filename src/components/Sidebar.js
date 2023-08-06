import styles from "@/styles/Sidebar.module.css";

import DailyIcon from "../../public/media/icon-daily.svg";
import DailyIconActive from "../../public/media/icon-daily-active.svg";
import FavIcon from "../../public/media/icon-favourite.svg";
import FavIconActive from "../../public/media/icon-favourite-active.svg";
import QuizIcon from "../../public/media/icon-quiz.svg";
import QuizIconActive from "../../public/media/icon-quiz-active.svg";
import HistoryIcon from "../../public/media/icon-history.svg";
import HistoryIconActive from "../../public/media/icon-history-active.svg";
import UserIcon from "../../public/media/icon-person.svg";
import UserIconActive from "../../public/media/icon-person-active.svg";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaBook,
  FaHistory,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";

const navArray = [
  {
    name: "Favourites",
    icon: <FaHeart fontSize={25} fill="#9c9c9c" />,
    route: "/favourites",
    active: <FaHeart fill="#a445ed" fontSize={25} />,
  },
  {
    name: "Daily Word",
    icon: <FaBook fontSize={25} fill="#9c9c9c" />,
    route: "/dailyword",
    active: <FaBook fill="#a445ed" fontSize={25} />,
  },
  {
    name: "Quiz",
    icon: <FaQuestionCircle fontSize={25} fill="#9c9c9c" />,
    route: "/quiz",
    active: <FaQuestionCircle fill="#a445ed" fontSize={25} />,
  },
  {
    name: "History",
    icon: <FaHistory fontSize={25} fill="#9c9c9c" />,
    route: "/history",
    active: <FaQuestionCircle fill="#a445ed" fontSize={25} />,
  },
  {
    name: "Admin",
    icon: <FaUser fontSize={25} fill="#9c9c9c" />,
    route: "/admin",
    active: <FaHistory fontSize={25} fill="#a445ed" />,
  },
];

export default function Sidebar() {
  const router = useRouter(); // Get the current router object
  const currentPath = router.pathname; // Get the current pathname
  return (
    <aside className={`${styles.sidebar__component} `}>
      <div className={styles.sidebar__nav}>
        {navArray.map((navItem) => (
          <Link
            href={navItem.route}
            key={navItem.name}
            className={`${currentPath === navItem.route ? styles.active : ""}`}
          >
            {currentPath === navItem.route ? (
              <div className={styles.nav__icon}>
                {navItem.active} {/* Render active icon */}
              </div>
            ) : (
              <div className={styles.nav__icon}>
                {navItem.icon} {/* Render default icon */}
              </div>
            )}
            {/* <div className={styles.nav__icon}>
              {navItem.icon}
            </div> */}
            {/* <DailyIcon /> */}
            {/* <navItem.icon /> */}
            {/* <Image
              key={navItem.name}
              src={
                currentPath === navItem.route ? navItem.active : navItem.icon
              }
              // src={navItem.icon}
              alt={`${navItem.name} icon`}
              width={25}
              height={25}
              className={styles.nav__icon}
            /> */}
          </Link>
        ))}
      </div>
    </aside>
  );
}

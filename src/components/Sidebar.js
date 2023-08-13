import styles from "@/styles/Sidebar.module.css";

import { useRouter } from "next/router";
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
    icon: <FaHeart fontSize={25} fill="#b7abab" strokeWidth={5} />,
    route: "/favourites",
    active: <FaHeart fill="#a445ed" fontSize={25} />,
  },
  {
    name: "Daily Word",
    icon: <FaBook fontSize={25} fill="#b7abab" />,
    route: "/dailyword",
    active: <FaBook fill="#a445ed" fontSize={25} />,
  },
  {
    name: "Quiz",
    icon: <FaQuestionCircle fontSize={25} fill="#b7abab" />,
    route: "/quiz",
    active: <FaQuestionCircle fill="#a445ed" fontSize={25} />,
  },
  {
    name: "History",
    icon: <FaHistory fontSize={25} fill="#b7abab" />,
    route: "/history",
    active: <FaHistory fill="#a445ed" fontSize={25} />,
  },
  {
    name: "Admin",
    icon: <FaUser fontSize={25} fill="#b7abab" />,
    route: "/admin",
    active: <FaUser fontSize={25} fill="#a445ed" />,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
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
              <div className={styles.nav__icon}>{navItem.active}</div>
            ) : (
              <div className={styles.nav__icon}>{navItem.icon}</div>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}

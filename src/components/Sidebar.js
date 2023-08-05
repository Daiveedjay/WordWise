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

const navArray = [
  {
    name: "Favourites",
    icon: FavIcon,
    route: "/favourites",
    active: FavIconActive,
  },
  {
    name: "Daily Word",
    icon: DailyIcon,
    route: "/dailyword",
    active: DailyIconActive,
  },
  { name: "Quiz", icon: QuizIcon, route: "/quiz", active: QuizIconActive },
  {
    name: "History",
    icon: HistoryIcon,
    route: "/history",
    active: HistoryIconActive,
  },
  { name: "Admin", icon: UserIcon, route: "/admin", active: UserIconActive },
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
            <Image
              key={navItem.name}
              src={
                currentPath === navItem.route ? navItem.active : navItem.icon
              }
              // src={navItem.icon}
              alt={`${navItem.name} icon`}
              width={25}
              height={25}
              className={styles.nav__icon}
            />
          </Link>
        ))}
      </div>
    </aside>
  );
}

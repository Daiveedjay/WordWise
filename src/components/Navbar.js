import Logo from "../../public/media/logo.svg";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import Search from "./Search";
import Dropdown from "./Dropdown";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className={`${styles.nav__component} `}>
      <Link className={styles.logo__container} href="/">
        <Image src={Logo} alt="Logo img" width={30} height={30} />
      </Link>
      <Search />

      <Dropdown />

      <ThemeToggle />
    </nav>
  );
}

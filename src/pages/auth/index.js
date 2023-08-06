import styles from "@/styles/Auth.module.css";
import GoogleIcon from "../../../public/media/icon-google.svg";
import GithubIcon from "../../../public/media/icon-github.svg";
import MailIcon from "../../../public/media/icon-mail.svg";
import PasswordIcon from "../../../public/media/icon-password.svg";
import UserIcon from "../../../public/media/icon-user.svg";
import Logo from "../../../public/media/logo.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSignup } from "@/hooks/useSignup";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useGoogleSignup } from "@/hooks/useGoogleSignup";
import { useGithubSignup } from "@/hooks/useGithubSignup";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function AuthPage() {
  const { user, authIsReady } = useAuthContext();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signup } = useSignup();

  const { signInWithGoogle } = useGoogleSignup();

  const { signInWithGithub } = useGithubSignup();
  console.log("My user, hopefully", user);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      toast.error("Make sure your password fields are the same");
    console.log(email, password, confirmPassword);
    await signup(email, password, displayName);
    toast.success("User signed up successfully");
  };

  if (user) router.push("/");
  return (
    <>
      <ToastContainer />
      {!user && authIsReady && (
        <div className={styles.Auth__page}>
          <div className={styles.Auth__header}>
            <Image src={Logo} alt="Logo icon" width={25} height={25} />
            <h1>Welcome to WordWise</h1>
          </div>

          <div className={styles.Auth__component}>
            <form onSubmit={handleSubmit} className={styles.Auth__form}>
              <div>
                <Image
                  src={MailIcon}
                  width={15}
                  height={15}
                  alt="password icon"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  // aria-autocomplete="inline"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  aria-required
                />
              </div>
              <div>
                <Image src={UserIcon} width={15} height={15} alt="user icon" />
                <input
                  type="text"
                  placeholder="Enter your Username"
                  onChange={(e) => setDisplayName(e.target.value)}
                  value={displayName}
                  aria-required
                />
              </div>
              <div>
                <Image
                  src={PasswordIcon}
                  width={15}
                  height={15}
                  alt="password icon"
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  aria-required
                />
              </div>
              <div>
                <Image
                  src={PasswordIcon}
                  width={15}
                  height={15}
                  alt="password icon"
                />
                <input
                  type="password"
                  placeholder="Confirm your password abeg, e get why"
                  aria-required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <button type="submit">Login</button>
            </form>
            <p className={styles.Auth__divider}>OR</p>
            <div className={styles.Auth__actions}>
              <div onClick={signInWithGoogle}>
                <Image
                  src={GoogleIcon}
                  width={20}
                  height={20}
                  alt="Google Icon"
                />
                <span>Continue with Google</span>
              </div>
              <div onClick={signInWithGithub}>
                <Image
                  src={GithubIcon}
                  width={20}
                  height={20}
                  alt="Github Icon"
                />
                <span>Continue with Github</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

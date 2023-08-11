import styles from "@/styles/Auth.module.css";
import GoogleIcon from "../../../public/media/icon-google.svg";
import Logo from "../../../public/media/logo.svg";
import {
  FaGithub,
  FaLock,
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSignup } from "@/hooks/useSignup";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useGoogleSignup } from "@/hooks/useGoogleSignup";
import { useGithubSignup } from "@/hooks/useGithubSignup";
import { useAuthContext } from "@/hooks/useAuthContext";
import LoadingComponent from "@/components/Loading";
import LoadingAnimation from "../../../public/media/Loading_animation.json";

export default function AuthPage() {
  const { user, authIsReady } = useAuthContext();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    toast.success("You signed up successfully");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const EyeIcon = showPassword ? FaEyeSlash : FaEye;

  if (user) router.push("/");
  return (
    <>
      <ToastContainer />
      {!authIsReady && <LoadingComponent LoadingAnimation={LoadingAnimation} />}
      {!user && authIsReady && (
        <div className={styles.Auth__page}>
          <div className={styles.Auth__header}>
            <Image src={Logo} alt="Logo icon" width={25} height={25} />
            <h1>Welcome to WordWise</h1>
          </div>

          <div className={styles.Auth__component}>
            <form onSubmit={handleSubmit} className={styles.Auth__form}>
              <div>
                <FaEnvelope
                  className={styles.input__icon}
                  fill="#9c9c9c"
                  fontSize={15}
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
                <FaUser
                  fill="#9c9c9c"
                  className={styles.input__icon}
                  fontSize={15}
                />
                <input
                  type="text"
                  placeholder="Enter your Username"
                  onChange={(e) => setDisplayName(e.target.value)}
                  value={displayName}
                  aria-required
                />
              </div>
              <div>
                <FaLock
                  fill="#9c9c9c"
                  className={styles.input__icon}
                  fontSize={15}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  aria-required
                />
                <EyeIcon
                  className={styles.toggle__password}
                  fill="#9c9c9c"
                  fontSize={15}
                  onClick={togglePasswordVisibility}
                />
              </div>
              <div>
                <FaLock
                  fill="#9c9c9c"
                  className={styles.input__icon}
                  fontSize={15}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password abeg, e get why"
                  aria-required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
                <EyeIcon
                  className={styles.toggle__password}
                  fill="#9c9c9c"
                  fontSize={15}
                  onClick={togglePasswordVisibility}
                />
              </div>
              <button type="submit">Sign Up</button>
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
                <FaGithub fontSize={20} />
                <span>Continue with Github</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
import { toast } from "react-hot-toast";

import { useSignup } from "@/hooks/useSignup";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useGoogleSignup } from "@/hooks/useGoogleSignup";
import { useGithubSignup } from "@/hooks/useGithubSignup";
import { useAuthContext } from "@/hooks/useAuthContext";
import LoadingComponent from "@/components/Loading";
import LoadingAnimation from "../../../public/media/Loading_animation.json";
import { useLogin } from "@/hooks/useLogin";

export default function AuthPage() {
  const { user, authIsReady } = useAuthContext();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(false);

  const {
    signup,
    isPending: signupIsPending,
    error: signupError,
  } = useSignup();

  const { login, isPending: loginIsPending, error: loginError } = useLogin();

  const { signInWithGoogle } = useGoogleSignup();

  const { signInWithGithub } = useGithubSignup();
  console.log("My user, hopefully", user);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      await login(email, password);

      // toast.success("You logged in successfully");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Make sure your password fields are the same");
      return;
    }

    await signup(email, password, displayName);

    if (user) toast.success("You signed in successfully");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleInputFields = () => {
    setIsLogin(!isLogin);
  };

  const EyeIcon = showPassword ? FaEyeSlash : FaEye;

  if (user) router.push("/");
  return (
    <>
      {!authIsReady && <LoadingComponent LoadingAnimation={LoadingAnimation} />}
      {loginIsPending && (
        <LoadingComponent LoadingAnimation={LoadingAnimation} />
      )}
      {!user && authIsReady && (
        <div className={styles.Auth__page}>
          <div className={styles.shaper__wrapper}>
            <div className={styles.shape}> </div>
            <div className={styles.second__shape}></div>
          </div>
          <div className={styles.Auth__header}>
            <Image src={Logo} alt="Logo icon" width={25} height={25} />
            <h1>Welcome to WordWise</h1>
          </div>

          <div className={styles.Auth__component}>
            <form onSubmit={handleSubmit} className={styles.Auth__form}>
              <div>
                <FaEnvelope
                  className={styles.input__icon}
                  fill="#b7abab"
                  fontSize={15}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-autocomplete="inline"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <FaUser
                    fill="#b7abab"
                    className={styles.input__icon}
                    fontSize={15}
                  />
                  <input
                    type="text"
                    placeholder="Enter your Username"
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                    required
                    aria-autocomplete="inline"
                  />
                </div>
              )}
              <div>
                <FaLock
                  fill="#b7abab"
                  className={styles.input__icon}
                  fontSize={15}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  aria-autocomplete="inline"
                />
                <EyeIcon
                  className={styles.toggle__password}
                  fill="#b7abab"
                  fontSize={15}
                  onClick={togglePasswordVisibility}
                />
              </div>
              {!isLogin && (
                <div>
                  <FaLock
                    fill="#b7abab"
                    className={styles.input__icon}
                    fontSize={15}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password abeg, e get why"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    aria-autocomplete="inline"
                  />
                  <EyeIcon
                    className={styles.toggle__password}
                    fill="#b7abab"
                    fontSize={15}
                    onClick={togglePasswordVisibility}
                  />
                </div>
              )}

              <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

              <p className={styles.login}>
                {!isLogin
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <span onClick={toggleInputFields}>
                  {!isLogin ? "Login here" : "Sign up"}
                </span>
              </p>
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

AuthPage.defaultProps = {
  title: "WordWise - Authentication",
  description: "Sign up or log in to your WordWise account.",
  keywords: "authentication, sign up, log in, user account, app",
};

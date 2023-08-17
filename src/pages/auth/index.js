import styles from "@/styles/Auth.module.css";
import GoogleIcon from "../../../public/media/icon-google.svg";
import Logo from "../../../public/media/logo.svg";
import { FaGithub } from "react-icons/fa";

import Image from "next/image";
import { useRouter } from "next/router";
import { useGoogleSignup } from "@/hooks/useGoogleSignup";
import { useGithubSignup } from "@/hooks/useGithubSignup";
import { useAuthContext } from "@/hooks/useAuthContext";
import LoadingComponent from "@/components/Loading";
import LoadingAnimation from "../../../public/media/Loading_animation.json";

export default function AuthPage() {
  const { user, authIsReady } = useAuthContext();

  const { signInWithGoogle } = useGoogleSignup();

  const { signInWithGithub } = useGithubSignup();

  const router = useRouter();

  if (user) router.push("/");
  return (
    <>
      {!authIsReady && <LoadingComponent LoadingAnimation={LoadingAnimation} />}
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

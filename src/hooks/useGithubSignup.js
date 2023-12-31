import { useEffect, useState } from "react";
import { auth, githubProvider } from "@/firebase/config";
import { useAuthContext } from "./useAuthContext";
import { signInWithPopup } from "firebase/auth";

export const useGithubSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const { dispatch } = useAuthContext();

  const signInWithGithub = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, githubProvider);

      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false); // Set isPending to false after the asynchronous call completes
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signInWithGithub };
};

import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/firebase/config";
import { useAuthContext } from "./useAuthContext";
import { signInWithPopup } from "firebase/auth";

export const useGoogleSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const { dispatch } = useAuthContext();

  const signInWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);

      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false); // Set isPending to false after the asynchronous call completes
        setError(null);
      }
    } catch (err) {
      console.error(err);
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signInWithGoogle };
};

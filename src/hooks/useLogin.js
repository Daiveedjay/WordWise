import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true); // Set isPending to true before starting the login process
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: "LOGIN", payload: res.user });
      console.log("user logged up", res.user);

      if (!isCancelled) {
        setIsPending(false); // Set isPending to false after successful login
        setError(null);
      }

      return true; // Return true on successful login
    } catch (err) {
      let customErrorMessage;
      switch (err.code) {
        case "auth/wrong-password":
          customErrorMessage = "The password you entered is incorrect.";
          break;
        case "auth/user-not-found":
          customErrorMessage =
            "There is no user associated with this email address.";
          break;
        default:
          customErrorMessage = err.message;
      }

      if (!isCancelled) {
        setError(customErrorMessage);
        setIsPending(false); // Set isPending to false after failed login
      }

      return false; // Return false on failed login
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { isPending, error, login };
};

import React, { useRef } from "react";
import { auth, login, signUp } from "../../firebase";

import "./SignupScreen.css";
function SignupScreen() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const register = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();

    if (emailRef.current && passwordRef.current)
      signUp(auth, emailRef.current.value, passwordRef.current.value)
        .then((authUser) => {})
        .catch((error) => {
          alert(error.message);
        });
  };

  const signIn = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (emailRef.current && passwordRef.current)
      login(auth, emailRef.current.value, passwordRef.current.value)
        .then((authUser) => {})
        .catch((error) => {
          alert(error.message);
        });
  };

  return (
    <div className="signupScreen">
      <form>
        <h1>Sign In</h1>
        <input ref={emailRef} placeholder="Email" type="email" />
        <input ref={passwordRef} placeholder="Password" type="password" />
        <button onClick={signIn} type="submit">
          Sign In
        </button>
        <h4>
          <span className="signupScreen__gray">New to Netflix? </span>
          <span className="signupScreen__link" onClick={register}>
            Sign up now.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;

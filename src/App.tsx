import React, { useEffect } from "react";
import "./App.css";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./slices/userSlice";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import MyList from "./screens/MyList/MyList";
import { Toaster } from "react-hot-toast";
function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userToken = await userAuth.getIdToken();
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
            userToken: userToken,
          })
        );
      } else if (!userAuth) {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="app">
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Switch>
            <Route path="/profile">
              <ProfileScreen />
            </Route>
            <Route exact path="/">
              <HomeScreen />
            </Route>
            <Route path="/my-list">
              <MyList />
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;

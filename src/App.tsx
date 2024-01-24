import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { RootState } from "./Redux";
import MainPage from "./Pages/MainPage";
import SignUpPage from "./Pages/SignUpPage";
import SignInPage from "./Pages/SignInPage";
import ProfilePage from "./Pages/ProfilePage";
import PeoplePage from "./Pages/peoplePage";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./Redux/auth";
const App: React.FC = () => {
  const isLogin = useSelector((state: RootState) => state.authReducer.isLogin);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const followed = useSelector(
    (state: RootState) => state.authReducer.followed
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogin && token) {
      dispatch(getUser(token) as any);
    }
  }, [token, isLogin]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLogin ? (
              followed ? (
                <Navigate to="/explore/people" />
              ) : (
                <MainPage />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/signup"
          element={!isLogin ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!isLogin ? <SignInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isLogin ? <ProfilePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/explore/people"
          element={isLogin ? <PeoplePage /> : <Navigate to="/signin" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

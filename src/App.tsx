import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { RootState } from "./Redux";
import MainPage from "./Pages/MainPage";
import SignUpPage from "./Pages/SignUpPage";
import SignInPage from "./Pages/SignInPage";
import ProfilePage from "./Pages/ProfilePage";
import PeoplePage from "./Pages/peoplePage";
import ExplorePage from "./Pages/explorePage";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./Redux/auth";
import { Snackbar } from "@mui/material";
import { resetSnackBar } from "./Redux/post";
const App: React.FC = () => {
  const isLogin = useSelector((state: RootState) => state.authReducer.isLogin);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const followed = useSelector(
    (state: RootState) => state.followReducer.followed
  );
  const updateProfile = useSelector(
    (state: RootState) => state.profileReducer.updateProfile
  );
  const showSnackBar = useSelector((state: RootState) => state.postReducer.showSnackBar);
  const message = useSelector((state: RootState) => state.postReducer.message);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogin && token) {
      dispatch(getUser(token) as any);
    }
  }, [token, isLogin, updateProfile]);
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(resetSnackBar());
  }
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
          path="/profile/:nickname"
          element={isLogin ? <ProfilePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/explore"
          element={isLogin ? <ExplorePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/explore/people"
          element={isLogin ? <PeoplePage /> : <Navigate to="/signin" />}
        />
      </Routes>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
      />
    </BrowserRouter>
    
  );
};

export default App;

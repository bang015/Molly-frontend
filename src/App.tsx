import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "./redux";
import MainPage from "./pages/main";
import SignUpPage from "./pages/sign/up";
import SignInPage from "./pages/sign/in";
import ProfilePage from "./pages/profile";
import PeoplePage from "./pages/people";
import ExplorePage from "./pages/explore";
import TagsPage from "./pages/tag";
import MessengerPage from "./pages/messenger";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/auth";
import { Snackbar } from "@mui/material";
import { resetSnackBar } from "./redux/post";

const App: React.FC = () => {
  const { isLogin } = useSelector(
    (state: RootState) => state.authReducer
  );
  const followed = useSelector(
    (state: RootState) => state.followReducer.followed
  );
  
  const showSnackBar = useSelector(
    (state: RootState) => state.postReducer.showSnackBar
  );
  const message = useSelector((state: RootState) => state.postReducer.message);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogin ) {
      dispatch(getUser() as any);
    }
  }, [ isLogin]);
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(resetSnackBar());
  };
  return (
    <>
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
        <Route
          path="/explore/tags/:tagName"
          element={isLogin ? <TagsPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/messenger"
          element={isLogin ? <MessengerPage /> : <Navigate to="/signin" />}
        />
      </Routes>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
      />
    </>
  );
};

export default App;

import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignIn, postUser } from "../../Redux/auth";
import Paper from "@mui/material/Paper";
import "./index.css";
import { Link } from "react-router-dom";
import { IUserforSignUp } from "../../Interfaces/user";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import SignUpForm from "../../Components/Sign/SignUpForm";
import { Button } from "@mui/material";
const SignUpPage: React.FC = () => {
  const [userState, setUserState] = useState<{
    user: IUserforSignUp;
    isValid: boolean;
  }>({
    user: {},
    isValid: false,
  });

  const { user, isValid } = userState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleValidation = useCallback((user: IUserforSignUp, isValid: boolean) => {
    if (isValid) setUserState({ user, isValid: true });
    else setUserState({ ...userState, isValid: false });
  }, []);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isValid && e.key == "Enter") handleSignUp(user, dispatch);
  };

  const handleSignUp = async (user: IUserforSignUp, dispatch: Dispatch) => {
    if(isValid){
      await dispatch(postUser(user) as any);
      await dispatch(postSignIn({email:user.email!, password: user.password!}) as any)
    }
      
      // navigate("/profile")
  };
  const handleSignUpBtn = () => {
    handleSignUp(user, dispatch);
  }
  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-left">
          <img
            className="logo"
            src="/images/molly.jpg"
            width="100%"
            alt="molly Logo"
          />
        </div>
        <div className="signup-right1">
          <Paper className="paper">
            <h1 className="paper-title">회원가입</h1>
            <SignUpForm
              handleValidation={handleValidation}
              handleEnter={handleEnter}
            />
            <Button className="signup-btn1" onClick={handleSignUpBtn}>가입</Button>
            <div className="goToSignIn">
              계정이 있으신가요? <Link to={"/signin"}>로그인</Link>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

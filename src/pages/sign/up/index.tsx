import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, createUser } from "@/redux/auth";
import Paper from "@mui/material/Paper";
import "./index.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import SignUpForm from "@/components/sign/SignUpForm";
import { Button } from "@mui/material";
import Logo from "@/icons/molly-logo.svg?react";
import { SignUpInput } from "@/interfaces/auth";
const SignUpPage: React.FC = () => {
  const [userState, setUserState] = useState<{
    user: SignUpInput;
    isValid: boolean;
  }>({
    user: {},
    isValid: false,
  });

  const { user, isValid } = userState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleValidation = useCallback(
    (user: SignUpInput, isValid: boolean) => {
      if (isValid) setUserState({ user, isValid: true });
      else setUserState({ ...userState, isValid: false });
    },
    []
  );

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isValid && e.key == "Enter") handleSignUp(user);
  };

  const handleSignUp = async (user: SignUpInput) => {
    if (isValid) {
      await dispatch(createUser(user) as any);
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-left">
          <Logo width={"600px"} />
        </div>
        <div className="signup-right">
          <Paper className="paper">
            <h1 className="paper-title">회원가입</h1>
            <SignUpForm
              handleValidation={handleValidation}
              handleEnter={handleEnter}
            />
            <Button
              className="signup-btn1"
              disabled={!isValid}
              onClick={() => {
                handleSignUp(user);
              }}
            >
              가입
            </Button>
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { getUser, postSignIn } from "../../Redux/auth";
import "./index.css";
import { useDispatch } from "react-redux";
const SignInPage: React.FC = () => {
  const dispatch = useDispatch();
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, email: e.target.value });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, password: e.target.value });
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") handleSignIn();
  };
  const handleSignIn = async () => {
    if (userData.email === "" || userData.password === "") {
      if (userData.email === "") {
        setHelperText("이메일을 입력해주세요.");
      } else if (userData.password === "") {
        setHelperText("비밀번호를 입력해주세요.");
      }
    }else{
      const token = await dispatch(postSignIn(userData) as any);
      if(token.payload !== null){
        await dispatch(getUser(token.payload) as any);
        navigate("/");
      }else{
        setHelperText("아이디 또는 비밀번호를 확인해주세요.")
      }
    }
  };
  
  const [userData, setUserData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const [helperText, setHelperText] = useState("");
  const navigate = useNavigate();
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
        <div className="signup-right">
          <Paper className="paper">
            <h1 className="paper-title">로그인</h1>
            <div className="signup-input-box">
              <TextField
                className="signup-input"
                type="email"
                label="이메일"
                required
                helperText={helperText}
                onChange={handleEmail}
                onKeyDown={handleEnter}
              />
            </div>
            <div className="signup-input-box">
              <TextField
                className="signup-input"
                type="text"
                label="비밀번호"
                required
                onChange={handlePassword}
                onKeyDown={handleEnter}
              />
            </div>
            <div>
              <Button
                className="signup-btn"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                회원가입
              </Button>
              <Button className="signup-btn" onClick={handleSignIn}>
                로그인
              </Button>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

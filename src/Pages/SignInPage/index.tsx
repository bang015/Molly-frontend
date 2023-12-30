import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import swal from "sweetalert";
import Paper from "@mui/material/Paper";
import "./index.css";
const SignInPage: React.FC = () => {
  const OnSignIn = async () => {
    if (email === "") {
      swal({
        title: "로그인 실패",
        text: "이메일을 입력하세요",
        icon: "warning",
      });
      return;
    }
    if (password === "") {
      swal({
        title: "로그인 실패",
        text: "비밀번호를 입력하세요",
        icon: "warning",
      });
      return;
    }
    const userData = {
      email: email,
      password: password,
    };
    await axios
      .post(`http://localhost:4000/api/auth`, userData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        console.log(response.data.user);
        if (response.data.status === true) {
          navigate("/");
        }
      })
      .catch((error) => {
        swal({
          title: "로그인 실패",
          text: "이메일 또는 비밀번호를 잘못 입력했습니다.",
          icon: "warning",
        });
      });
  };
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-left">
          <img
            className="logo"
            src="/images/molly.jpg"
            width="800vw"
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
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="signup-input-box">
              <TextField
                className="signup-input"
                type="text"
                label="비밀번호"
                value={password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
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
              <Button className="signup-btn" onClick={OnSignIn}>
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

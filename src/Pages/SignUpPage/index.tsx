import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import swal from "sweetalert";
import Paper from "@mui/material/Paper";
import "./index.css";
import { Link } from "react-router-dom";
const SignUpPage: React.FC = () => {

  const OnSignUp = async () => {
    if (email === "") {
      swal({
        title: "회원가입 실패",
        text: "이메일을 입력하세요",
        icon: "warning",
      });
      return;
    }
    if (name === "") {
      swal({
        title: "회원가입 실패",
        text: "이름을 입력하세요",
        icon: "warning",
      });
      return;
    }
    if (nickname === "") {
      swal({
        title: "회원가입 실패",
        text: "닉네임을 입력하세요",
        icon: "warning",
      });
      return;
    }
    if (password === "") {
      swal({
        title: "회원가입 실패",
        text: "비밀번호를 입력하세요",
        icon: "warning",
      });
      return;
    }
    if (password !== passwordCheck) {
      swal({
        title: "회원가입 실패",
        text: "비밀번호가 일치하지 않습니다.",
        icon: "warning",
      });
      return;
    }
    const userData = {
      email: email,
      password: password,
      name: name,
      nickname: nickname,
    };
    await axios
      .post(`http://localhost:4000/api/users`, userData)
      .then((response) => {
        swal({
          title: "회원가입 성공",
          icon: "success",
        });
        navigate("/signin");
      })
      .catch((error) => {
        console.error("error", error);
      });
  };
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
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
        <div className="signup-right1">
          <Paper className="paper">
            <h1 className="paper-title">회원가입</h1>
            <form onSubmit={OnSignUp}>
              <div className="signup-input-box">
                <TextField
                  className="signup-input"
                  type="email"
                  label="이메일을 입력해주세요."
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
                  label="이름을 입력해주세요."
                  value={name}
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="signup-input-box">
                <TextField
                  className="signup-input"
                  type="text"
                  label="닉네임을 입력해주세요."
                  value={nickname}
                  required
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                />
              </div>
              <div className="signup-input-box">
                <TextField
                  className="signup-input"
                  type="password"
                  label="비밀번호를 입력해주세요."
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="signup-input-box">
                <TextField
                  className="signup-input"
                  type="password"
                  label="비밀번호를 확인해주세요."
                  value={passwordCheck}
                  required
                  onChange={(e) => {
                    setPasswordCheck(e.target.value);
                  }}
                />
              </div>
            </form>
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

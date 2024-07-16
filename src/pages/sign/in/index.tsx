import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { signIn } from "@/redux/auth";
import "./index.css";
import { useDispatch } from "react-redux";
import Logo from "@/icons/molly-logo.svg?react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const SignInPage: React.FC = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const [helperText, setHelperText] = useState<{
    email: string;
    password: string;
    falseLogin: string;
  }>({
    email: "",
    password: "",
    falseLogin: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, email: e.target.value });
    setHelperText({ ...helperText, email: "" });
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, password: e.target.value });
    setHelperText({ ...helperText, password: "" });
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") handleSignIn();
  };
  const handleSignIn = async () => {
    if (userData.email === "") {
      return setHelperText({ ...helperText, email: "이메일을 입력해주세요." });
    } else if (userData.password === "") {
      return setHelperText({
        ...helperText,
        password: "비밀번호를 입력해주세요.",
      });
    }
    const regExp =
      /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!regExp.test(userData.email)) {
      return setHelperText({
        ...helperText,
        email: "유효한 이메일 주소를 입력해주세요.",
      });
    }
    const token = await dispatch(signIn(userData) as any);
    if (token.payload === null) {
      setHelperText({
        ...helperText,
        falseLogin: "아이디 또는 비밀번호를 확인해주세요.",
      });
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const navigate = useNavigate();
  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-left">
          <Logo width={"600px"} />
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
                error={helperText.email != ""}
                helperText={helperText.email}
                onChange={handleEmail}
                onKeyDown={handleEnter}
              />
            </div>
            <div className="signup-input-box">
              <TextField
                className="signup-input"
                type={showPassword ? "text" : "password"}
                label="비밀번호"
                required
                helperText={helperText.password}
                onChange={handlePassword}
                onKeyDown={handleEnter}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="false">{helperText.falseLogin}</div>
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

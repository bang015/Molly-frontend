import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PropTypes from "prop-types";
import {
  checkEmailValidation,
  checkNickValidation,
  checkNameValidation,
  checkPasswordValidation,
} from "../../../Utils/validation";
import { IUserforSignUp } from "../../../Interfaces/user";

interface SignUpFormProps {
  handleValidation: (user: IUserforSignUp, isValid: boolean) => void;
  handleEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  handleValidation,
  handleEnter,
}) => {
  type ValidationState = {
    [key: string]: boolean;
  };
  const [user, setUser] = useState({
    email: "",
    name: "",
    nickname: "",
    password: "",
  });
  
  const [isValid, setIsValid] = useState<ValidationState>({
    email: false,
    name: false,
    nickname: false,
    password: false,
  });

  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    if (isValid.email && isValid.name && isValid.password && isValid.nickname) {
      handleValidation(user, true);
    } else {
      handleValidation(user, false);
    }
  }, [
    isValid.email,
    isValid.name,
    isValid.nickname,
    isValid.password,
    user,
    handleValidation,
  ]);

  const handleEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: e.target.value });
    const result = await checkEmailValidation(e.target.value);
    setIsValid({ ...isValid, email: result.isValid });
  };
  const handleName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value });
    const result = checkNameValidation(e.target.value);
    
    setIsValid({ ...isValid, name: result.isValid });
    console.log(isValid.name);
  };
  const handleNick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, nickname: e.target.value });
    const result = await checkNickValidation(e.target.value);
    setIsValid({ ...isValid, nickname: result.isValid });
  };
  const handlePassword = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, password: e.target.value });
    const result = checkPasswordValidation(e.target.value);
    setIsValid({ ...isValid, password: result.isValid });
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const renderAdornment = (fieldName: string) => {
    
    if (focusedField !== fieldName) {
      return (
        <InputAdornment position="end">
          {isValid[fieldName] ? (
            <CheckCircleOutlineIcon />
          ) : (
            <HighlightOffIcon style={{ color: 'red' }} />
          )}
        </InputAdornment>
      );
    }
    return null;
  };
  return (
    <form>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="email"
          label="이메일을 입력해주세요."
          required
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
          onChange={handleEmail}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: user.email !== ""&&renderAdornment('email'),
          }}
        />
      </div>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="text"
          label="이름을 입력해주세요."
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
          required
          onChange={handleName}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: user.name !== "" && renderAdornment('name'),
          }}
        />
      </div>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="text"
          label="닉네임을 입력해주세요."
          onFocus={() => handleFocus("nickname")}
          onBlur={handleBlur}
          required
          onChange={handleNick}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: user.nickname !== "" &&  renderAdornment('nickname'),
          }}
        />
      </div>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="password"
          label="비밀번호를 입력해주세요."
          onFocus={() => handleFocus("password")}
          onBlur={handleBlur}
          required
          onChange={handlePassword}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: user.password !== "" &&  renderAdornment('password'),
          }}
        />
      </div>
    </form>
  );
};

SignUpForm.propTypes = {
  handleValidation: PropTypes.func.isRequired,
  handleEnter: PropTypes.func.isRequired,
};

export default SignUpForm;

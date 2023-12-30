import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';
import {
  checkEmailValidation,
  checkNickValidation,
  checkNameValidation,
  checkPasswordValidation,
} from "../../../Utils/validation";
import { userType } from "../../../Interfaces/user";

interface SignUpFormProps {
  handleValidation: (user: userType | null, isValid: boolean) => void;
  handleEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  handleValidation,
  handleEnter,
}) => {
  const [user, setUser] = useState({
    email: "",
    name: "",
    nickname: "",
    password: "",
  });

  const [isValid, setIsValid] = useState({
    email: false,
    name: false,
    nickname: false,
    password: false,
  });

  useEffect(() => {
    if (isValid.email && isValid.name && isValid.password) {
      handleValidation(user, true);
    } else {
      handleValidation(null, false);
    }
  }, [isValid, user, handleValidation]);

  const handleEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: e.target.value });
    const result = await checkEmailValidation(e.target.value);
    setIsValid({ ...isValid, email: result.isValid });
  };
  const handleName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value });
    const result = checkNameValidation(e.target.value);
    setIsValid({ ...isValid, name: result.isValid });
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

  return (
    <form>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="email"
          label="이메일을 입력해주세요."
          required
          onChange={handleEmail}
        />
      </div>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="text"
          label="이름을 입력해주세요."
          required
          onChange={handleName}
        />
      </div>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="text"
          label="닉네임을 입력해주세요."
          required
          onChange={handleNick}
        />
      </div>
      <div className="signup-input-box">
        <TextField
          className="signup-input"
          type="password"
          label="비밀번호를 입력해주세요."
          required
          onChange={handlePassword}
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
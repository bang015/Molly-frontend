import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  checkEmailValidation,
  checkNickValidation,
  checkNameValidation,
  checkPasswordValidation,
} from "@/utils/validation";
import { IUserforSignUp } from "@/interfaces/user";

interface SignUpFormProps {
  handleValidation: (user: IUserforSignUp, isValid: boolean) => void;
  handleEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface field {
  email: string;
  name: string;
  nickname: string;
  password: string;
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
  const [helperText, setHelperText] = useState({
    email: "",
    name: "",
    nickname: "",
    password: "",
  });
  const [error, setError] = useState({
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

  const handleChange = async (
    field: string,
    value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser((prevState) => ({
      ...prevState,
      [field]: value.target.value,
    }));
    const fieldInfo = inputFields.find((item) => item.field === field);
    if (fieldInfo) {
      const { validation, field } = fieldInfo;
      const result = await validation(value.target.value);
      setHelperText((prevHelperText) => ({
        ...prevHelperText,
        [field]: result.helperText,
      }));
      setIsValid((prevIsValid) => ({
        ...prevIsValid,
        [field]: result.isValid,
      }));
      setError((prevError) => ({
        ...prevError,
        [field]: !result.isValid,
      }));
    }
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
            <HighlightOffIcon style={{ color: "red" }} />
          )}
        </InputAdornment>
      );
    }
    return null;
  };
  const inputFields = [
    {
      type: "email",
      placeholder: "이메일을 입력해주세요.",
      field: "email",
      validation: checkEmailValidation,
    },
    {
      type: "text",
      placeholder: "성명을 입력해주세요.",
      field: "name",
      validation: checkNameValidation,
    },
    {
      type: "text",
      placeholder: "사용자 이름을 입력해주세요.",
      field: "nickname",
      validation: checkNickValidation,
    },
    {
      type: "password",
      placeholder: "비밀번호를 입력해주세요.",
      field: "password",
      validation: checkPasswordValidation,
    },
  ];
  return (
    <form>
      {inputFields.map((fieldInfo) => (
      <div className="signup-input-box" key={fieldInfo.field}>
        <TextField
          className="signup-input"
          type={fieldInfo.type}
          placeholder={fieldInfo.placeholder}
          onFocus={() => handleFocus(fieldInfo.field)}
          onBlur={handleBlur}
          required
          helperText={focusedField !== fieldInfo.field && helperText[fieldInfo.field as keyof field]}
          error={focusedField !== fieldInfo.field && error[fieldInfo.field as keyof field]}
          onChange={(e) => handleChange(fieldInfo.field, e)}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: user[fieldInfo.field as keyof typeof user] !== '' && renderAdornment(fieldInfo.field),
          }}
        />
      </div>
    ))}
    </form>
  );
};

export default SignUpForm;

import { INIT, USER_API, QUERY_EMAIL, QUERY_NICKNAME } from "./api-url";
import axios from "axios";

export const checkEmailExists = async (email: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}${INIT}${USER_API}${QUERY_EMAIL}${email}`
  );
  if (response.status === 204) {
    return false;
  }
  return true;
};

export const checkEmailValidation = async (email: string) => {
  const regExp =
    /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  let isValid;
  let helperText ="";
  if (!email) {
    isValid = false;
    helperText = "이메일을 입력해주세요.";
  } else if (!regExp.test(email)) {
    isValid = false;
    helperText = "유효한 이메일 주소를 입력해주세요.";
  } else {
    const result = await checkEmailExists(email);
    if (result) {
      isValid = false;
      helperText = "이미 사용중인 이메일입니다.";
    } else {
      isValid = true;
      helperText = "";
    }
  }
  return { isValid, helperText };
};

export const checkNickExists = async (nickname: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}${INIT}${USER_API}${QUERY_NICKNAME}${nickname}`,
    { method: "GET" }
  );
  if (response.status === 204) {
    return false;
  }
  return true;
};

export const checkNickValidation = async (nickname: string) => {
  const regExp = /^[가-힣A-Za-z0-9_.]{3,12}$/;
  const isSpecial = /\W/;
  let isValid;
  let helperText = "";

  if (!nickname) {
    isValid = false;
    helperText = "사용자 이름을 입력해주세요.";
  } else if (!regExp.test(nickname)) {
    isValid = false;
    if (isSpecial.test(nickname)) {
      helperText = "특수 문자는 사용할 수 없습니다.";
    } else if (nickname.length < 3) {
      helperText = "사용자 이름은 최소 3자 이상 입력해주세요.";
    } else if (nickname.length > 30) {
      helperText = "사용자 이름은 최대 12자까지 입력 가능합니다.";
    }
  } else {
    const result = await checkNickExists(nickname);
    if (result) {
      isValid = false;
      helperText = "이미 사용 중인 이름입니다.";
    } else {
      isValid = true;
      helperText = "";
    }
  }

  return { isValid, helperText };
};

export const checkNameValidation = (name: string) => {
  const regExp = /^[가-힣A-Za-z0-9_.]{2,10}$/;
  let isValid;
  let helperText ="";

  if (!name) {
    isValid = false;
    helperText = "이름을 입력해주세요.";
  } else if (!regExp.test(name)) {
    isValid = false;
    helperText = "올바른 이름을 입력해주세요.";
    if (name.length < 2) {
      helperText = "이름은 최소 2자 이상 입력해주세요.";
    } else if (name.length < 5) {
      helperText = "이름은 최대 10자까지 입력 가능합니다.";
    }
  } else {
    isValid = true;
  }

  return { isValid, helperText };
};
export const checkPasswordValidation = (password: string) => {
  const regExp = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,16}$/;
  const isNum = /^(?=.*[0-9])/;
  const isChar = /^(?=.*[a-zA-Z])/;
  let isValid;
  let helperText = "";

  if (!password) {
    isValid = false;
    helperText = "비밀번호를 입력해주세요.";
  } else if (!regExp.test(password)) {
    isValid = false;
    if (!isNum.test(password)) {
      helperText = "비밀번호에는 최소 1개 이상의 숫자를 포함해야 합니다.";
    } else if (!isChar.test(password)) {
      helperText = "비밀번호에는 최소 1개 이상의 알파벳을 포함해야 합니다.";
    } else if (password.length < 8) {
      helperText = "비밀번호는 최소 8자 이상 입력해주세요.";
    } else if (password.length > 16) {
      helperText = "비밀번호는 최대 16자까지 입력 가능합니다.";
    }
  } else {
    isValid = true;
    helperText = "";
  }

  return { isValid, helperText };
};

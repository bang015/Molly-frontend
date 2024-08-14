import React, { useState } from 'react'
import { createUser, sendVerificationCode } from '@/redux/auth'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { TextField } from '@mui/material'
import Logo from '@/icons/molly-logo.svg?react'
import {
  checkEmailValidation,
  checkNameValidation,
  checkNickValidation,
  checkPasswordValidation,
} from '@/utils/validation'

interface field {
  email: string
  name: string
  nickname: string
  password: string
}
interface User {
  email: string
  name: string
  nickname: string
  password: string
  code: string
  [key: string]: string
}
const SignUpPage: React.FC = () => {
  const dispatch = useDispatch()
  type ValidationState = {
    [key: string]: boolean
  }
  const [user, setUser] = useState<User>({
    email: '',
    name: '',
    nickname: '',
    password: '',
    code: '',
  })
  const [isValid, setIsValid] = useState<ValidationState>({
    email: false,
    name: false,
    nickname: false,
    password: false,
  })
  const [helperText, setHelperText] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
  })
  const [error, setError] = useState({
    email: false,
    name: false,
    nickname: false,
    password: false,
  })
  const [isVerificationStage, setIsVerificationStage] = useState(false)
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter')
      if (isVerificationStage) {
        if (isValid.email && isValid.name && isValid.password && isValid.nickname) {
          handleSignUp()
        }
      } else {
        handleSendVerificationCode()
      }
  }
  const handleSignUp = async () => {
    if (isValid.email && isValid.name && isValid.password && isValid.nickname && user.code !== '') {
      await dispatch(createUser(user) as any)
    }
  }
  const handleChange = async (
    field: string,
    value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUser(prevState => ({
      ...prevState,
      [field]: value.target.value,
    }))
    const fieldInfo = inputFields.find(item => item.field === field)
    if (fieldInfo) {
      const { validation, field } = fieldInfo
      const result = await validation(value.target.value)
      setHelperText(prevHelperText => ({
        ...prevHelperText,
        [field]: result.helperText,
      }))
      setIsValid(prevIsValid => ({
        ...prevIsValid,
        [field]: result.isValid,
      }))
      setError(prevError => ({
        ...prevError,
        [field]: !result.isValid,
      }))
    }
  }
  const handleSendVerificationCode = () => {
    sendVerificationCode(user.email)
    setIsVerificationStage(true)
  }

  const inputFields = [
    {
      type: 'email',
      label: '이메일을 입력해주세요.',
      field: 'email',
      validation: checkEmailValidation,
    },
    {
      type: 'text',
      label: '성명을 입력해주세요.',
      field: 'name',
      validation: checkNameValidation,
    },
    {
      type: 'text',
      label: '사용자 이름을 입력해주세요.',
      field: 'nickname',
      validation: checkNickValidation,
    },
    {
      type: 'password',
      label: '비밀번호를 입력해주세요.',
      field: 'password',
      validation: checkPasswordValidation,
    },
  ]
  return (
    <section className="flex size-full items-center justify-center bg-background p-4">
      <div className="relative flex w-[480px] flex-col items-center rounded-xl bg-white p-8 shadow-modal">
        <Logo width={'200px'} />
        <h1 className="p-5 text-center">{!isVerificationStage ? '회원가입' : '인증 코드 입력'}</h1>
        {!isVerificationStage ? (
          <>
            <form className="w-full">
              {inputFields.map(fieldInfo => (
                <div className="mt-3 h-20 w-full" key={fieldInfo.field}>
                  <TextField
                    className="size-full"
                    type={fieldInfo.type}
                    label={fieldInfo.label}
                    required
                    value={user[fieldInfo.field]}
                    helperText={helperText[fieldInfo.field as keyof field]}
                    error={error[fieldInfo.field as keyof field]}
                    onChange={e => handleChange(fieldInfo.field, e)}
                    onKeyDown={handleEnter}
                  />
                </div>
              ))}
            </form>
            <button
              className="btn mt-5 w-full px-1"
              disabled={!isValid.email || !isValid.name || !isValid.password || !isValid.nickname}
              onClick={() => {
                handleSendVerificationCode()
              }}
            >
              가입
            </button>
          </>
        ) : (
          <div>
            <div className="text-body16rg pb-5">
              {user.email}주소로 전송된 인증코드를 입력하세요.{' '}
              <button
                onClick={() => {
                  handleSendVerificationCode()
                }}
                className="text-main hover:text-hover"
              >
                코드 재전송
              </button>
            </div>
            <div>
              <TextField
                className="size-full"
                type="text"
                label="인증 코드"
                required
                onChange={e => {
                  setUser({ ...user, code: e.target.value })
                }}
                onKeyDown={handleEnter}
              />
            </div>
            <button
              className="btn mt-5 w-full px-1"
              disabled={user.code === ''}
              onClick={() => {
                handleSignUp()
              }}
            >
              다음
            </button>
            <div className="pt-3 text-center">
              <button
                onClick={() => {
                  setIsVerificationStage(false)
                }}
                className="text-body16sd text-main"
              >
                돌아가기
              </button>
            </div>
          </div>
        )}
        <button className="link mt-4">
          <Link className="text-body14rg text-slate-400" to="/sign/in">
            이미 계정이 있으신가요?
          </Link>
        </button>
      </div>
    </section>
  )
}

export default SignUpPage

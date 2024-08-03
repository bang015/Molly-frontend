import React, { useState } from 'react'
import { createUser } from '@/redux/auth'
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
const SignUpPage: React.FC = () => {
  const dispatch = useDispatch()
  type ValidationState = {
    [key: string]: boolean
  }
  const [user, setUser] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
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
  const [focusedField, setFocusedField] = useState('')
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isValid.email && isValid.name && isValid.password && isValid.nickname && e.key == 'Enter')
      handleSignUp()
  }
  const handleSignUp = async () => {
    console.log(isValid, user)
    if (isValid.email && isValid.name && isValid.password && isValid.nickname) {
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
  const handleFocus = (field: string) => {
    setFocusedField(field)
  }
  const handleBlur = () => {
    setFocusedField('')
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
      <div className="w-[480px] p-8 relative flex rounded-xl bg-white items-center flex-col shadow-modal">
        <Logo width={'200px'} />
        <h1 className="p-5">회원가입</h1>
        <form className="w-full">
          {inputFields.map(fieldInfo => (
            <div className="mt-3 h-20 w-full" key={fieldInfo.field}>
              <TextField
                className="size-full"
                type={fieldInfo.type}
                label={fieldInfo.label}
                onFocus={() => handleFocus(fieldInfo.field)}
                onBlur={handleBlur}
                required
                helperText={
                  focusedField !== fieldInfo.field && helperText[fieldInfo.field as keyof field]
                }
                error={focusedField !== fieldInfo.field && error[fieldInfo.field as keyof field]}
                onChange={e => handleChange(fieldInfo.field, e)}
                onKeyDown={handleEnter}
              />
            </div>
          ))}
        </form>
        <button
          className="btn w-full px-1 mt-5"
          disabled={!isValid.email || !isValid.name || !isValid.password || !isValid.nickname}
          onClick={() => {
            handleSignUp()
          }}
        >
          가입
        </button>
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

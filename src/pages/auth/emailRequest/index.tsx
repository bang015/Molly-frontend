import Logo from '@/icons/molly-logo.svg?react'
import { sendPasswordResetLink, signOut } from '@/redux/auth'
import { CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const EmailReqeust: React.FC = () => {
  const [email, setEmail] = useState('')
  const [helperText, setHelperText] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [config, setConfig] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    const regExp = /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    if (!e.target.value) {
      setIsValid(false)
      setHelperText('이메일을 입력해주세요.')
    } else if (!regExp.test(e.target.value)) {
      setIsValid(false)
      setHelperText('유효한 이메일 주소를 입력해주세요.')
    } else {
      setIsValid(true)
      setHelperText('')
    }
  }
  const sendPasswordReset = async () => {
    if (isValid) {
      setIsLoading(true)
      try {
        const result = await sendPasswordResetLink(email)
        alert(result)
        setConfig(true)
      } catch (e) {
        console.error('Error sending reset link', e)
      } finally {
        setIsLoading(false)
      }
    }
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      sendPasswordReset()
    }
  }
  return (
    <section className="flex size-full items-center justify-center bg-background p-4">
      <div className="relative flex w-[480px] flex-col items-center rounded-xl bg-white p-8 shadow-modal">
        <Logo width={'200px'} />
        <h1 className="py-5">비밀번호를 잊으셨나요?</h1>
        {config ? (
          <div className="py-5">
            <div>{email}로 비밀번호 재설정 링크를 보내드렸어요!</div>
            <button className="py-2 text-body14sd text-main" onClick={sendPasswordReset}>
            {isLoading ? <CircularProgress /> : '링크 재전송'}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center text-body14rg text-slate-400">
              이메일 주소를 입력하시면 해당 이메일로 비밀번호를 재설정할 수 있는 링크를
              보내드립니다.
            </div>
            <div className="mt-7 w-full">
              <TextField
                className="size-full"
                type="email"
                label="이메일"
                required
                helperText={helperText}
                error={helperText !== ''}
                onChange={handleEmail}
                onKeyDown={handleEnter}
              />
            </div>
            <button
              onClick={sendPasswordReset}
              disabled={!isValid || isLoading}
              className="btn my-5 w-full"
            >
              {isLoading ? <CircularProgress /> : '링크 보내기'}
            </button>
          </div>
        )}

        <button className="link mt-4">
          <Link
            className="text-body14rg text-slate-400"
            to="/sign/in"
            onClick={() => {
              dispatch(signOut() as any)
            }}
          >
            이미 계정이 있으신가요?
          </Link>
        </button>
      </div>
    </section>
  )
}

export default EmailReqeust

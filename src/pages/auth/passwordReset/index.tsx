import { TextField } from '@mui/material'
import Logo from '@/icons/molly-logo.svg?react'
import { useState } from 'react'

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }
  return (
    <section className="flex size-full items-center justify-center bg-background p-4">
      <div className="w-[480px] p-8 relative flex rounded-xl bg-white items-center flex-col shadow-modal">
        <Logo width={'200px'} />
        <h1 className="pt-5">보안 수준이 높은 비밀번호 만들기</h1>
        <div className="text-center text-body14rg text-slate-400">
          비밀번호는 6자 이상이어야 하고 숫자, 영문, 특수기호(!$@%)의 조합을 포함해야 합니다
        </div>
        <div className="mt-7 w-full">
          <TextField
            className="size-full"
            type="email"
            label="새 비밀번호"
            required
            onChange={handlePassword}
            // onKeyDown={handleEnter}
          />
        </div>
        <div className="mt-7 mb-2 w-full">
          <TextField
            className="size-full"
            type={'password'}
            label="새 비밀번호 확인"
            required
            onChange={handleConfirmPassword}
            // onKeyDown={handleEnter}
          />
        </div>
        <button
          disabled={password === '' || confirmPassword === ''}
          className="btn w-full px-1 mt-10"
        >
          비밀번호 재설정
        </button>
      </div>
    </section>
  )
}

export default PasswordReset

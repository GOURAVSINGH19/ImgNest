import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface VerificationCode {
  value: string,
  handleOTPChange: () => void
}

export function InputOTPDemo({ value, handleOTPChange }: VerificationCode) {
  return (
    <InputOTP maxLength={6} autoFocus>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} onChange={handleOTPChange} />
        <InputOTPSlot index={2} onChange={handleOTPChange} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} onChange={handleOTPChange} />
        <InputOTPSlot index={4} onChange={handleOTPChange} />
        <InputOTPSlot index={5} onChange={handleOTPChange} />
      </InputOTPGroup>
    </InputOTP>
  )
}

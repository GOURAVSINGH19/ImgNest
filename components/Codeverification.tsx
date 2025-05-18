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
  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 1) {
      const newOtp = [...value];
      newOtp[index] = newValue;
      handleOTPChange();
    }
  };

  return (
    <InputOTP maxLength={6} autoFocus>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} onChange={handleChange(1)} />
        <InputOTPSlot index={2} onChange={handleChange(2)} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} onChange={handleChange(3)} />
        <InputOTPSlot index={4} onChange={handleChange(4)} />
        <InputOTPSlot index={5} onChange={handleChange(5)} />
      </InputOTPGroup>
    </InputOTP>
  )
}

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  
  export function CodeOTP({
    value,
    setValue
  }: {
    value: string; 
    setValue: React.Dispatch<React.SetStateAction<string>>
  }) {
    return (
      <InputOTP value={value} onChange={(e) => setValue(e)} maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    )
  }
  
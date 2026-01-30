import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { PhoneStep } from "./PhoneStep";
import { CodeStep } from "./CodeStep";

type Step = "phone" | "code";

export function AuthForm({ onLogin }: { onLogin: () => void }) {
  const { sendCode, login, phone, error, clearError } = useAuth();
  const [step, setStep] = useState<Step>("phone");

  const handleSendCode = async (phone: string) => {
    const ok = await sendCode(phone, "cascade");
    if (ok) setStep("code");
  };

  const handleVerifyCode = async (code: string) => {
    const ok = await login(phone, code);
    if (ok) onLogin();
  };

  const handleResendSms = async () => {
    await sendCode(phone, "cascade");
  };

  const handleChangePhone = () => {
    setStep("phone");
    clearError();
  };

  return (
    <div className="app-container">
      {step === "phone" ? (
        <PhoneStep onSend={handleSendCode} error={error} authPhone={phone} />
      ) : (
        <CodeStep
          phone={phone}
          onVerify={handleVerifyCode}
          onResendSms={handleResendSms}
          onChangePhone={handleChangePhone}
          error={error}
        />
      )}
    </div>
  );
}

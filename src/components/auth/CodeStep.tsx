import { useState } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import resendImg from "../../assets/resend.png";

interface CodeStepProps {
  phone: string;
  onVerify: (code: string) => void;
  onResendSms: () => void;
  onChangePhone: () => void;
  error: string | null;
}

export function CodeStep({
  phone,
  onVerify,
  onResendSms,
  onChangePhone,
  error,
}: CodeStepProps) {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { timeLeft, reset } = useCountdown(90);

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = event.target.value.replace(/\D/g, "").slice(0, 4);
    setCode(newCode);
    if (newCode.length === 4) {
      onVerify(newCode);
      setCode("");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await onResendSms();
    reset();
    setIsResending(false);
  };

  return (
    <>
      <p className="title">Введите код из Telegram или СМС</p>
      <p className="subtitle">
        Код отправлен на номер +{phone}. Действует {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>

      <div className="code-container">
        <div className="code-2-container">
          <input
            type="tel"
            inputMode="numeric"
            maxLength={4}
            value={code}
            onChange={handleCodeChange}
            placeholder="Код"
            className="input"
          />

          {timeLeft <= 0 && (
            <button
              className="button resend-button"
              onClick={handleResend}
              disabled={isResending}
            >
              <img src={resendImg} className="resend-img" alt="resend" />
            </button>
          )}
        </div>

        {error && <p className="notification">{error}</p>}

        <a className="change-phone" onClick={onChangePhone}>
          Изменить номер
        </a>
      </div>
    </>
  );
}

import { useState } from "react";
import { PhoneInput } from "./PhoneInput";

interface PhoneStepProps {
  onSend: (phone: string) => void;
  authPhone: string | null;
  error: string | null;
}

export function PhoneStep({ onSend, error, authPhone }: PhoneStepProps) {
  const [phone, setPhone] = useState(authPhone ? authPhone : "");

  const handleSubmit = () => {
    if (phone.length === 11) onSend(phone);
  };

  return (
    <>
      <p className="title">Войти или зарегистрироваться</p>
      <div className="phone-container">
        <PhoneInput value={phone} onChange={setPhone} />
        {error && <p className="notification">{error}</p>}
        <button
          className="button phone-button"
          onClick={handleSubmit}
          disabled={phone.length !== 11}
        >
          Продолжить
        </button>
      </div>
    </>
  );
}

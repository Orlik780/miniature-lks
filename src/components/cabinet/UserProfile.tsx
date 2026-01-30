import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../utils/apiClient";

interface UserProfileProps {
  profile: UserProfile;
}

export function UserProfile({ profile }: UserProfileProps) {
  const { logout } = useAuth();
  const fullName = [profile.lastName, profile.firstName, profile.middleName]
    .filter(Boolean)
    .join(" ");

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="lk-module user-profile">
      <div>
        {profile.photo ? (
          <img src={profile.photo} alt="Аватар" className="avatar" />
        ) : (
          <div className="avatar-placeholder">
            <p>
              {profile.firstName?.[0] || "?"}
              {profile.lastName?.[0] || "?"}
            </p>
          </div>
        )}
        <h2 className="full-name">{fullName}</h2>{" "}
      </div>
      <p className="lk-info-field">Телефон: +{profile.phone}</p>
      {profile.email && <p className="lk-info-field">Email: {profile.email}</p>}
      <p className="lk-info-field">Карта лояльности: {profile.loyaltyCard}</p>
      <p className="lk-info-field">Категория: {profile.clientCategory.name}</p>
      <p className="lk-info-field">Баланс: {profile.deposit / 100} ₽</p>
      <p>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </p>
    </div>
  );
}

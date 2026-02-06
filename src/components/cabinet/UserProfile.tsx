import { useAuth } from "../../context/AuthContext";
import type { UserProfileType } from "../../utils/apiClient";

interface UserProfileProps {
  profile: UserProfileType;
  openEditForm: () => void;
}

export function UserProfile({ profile, openEditForm }: UserProfileProps) {
  const { logout } = useAuth();
  const fullName = [profile.lastName, profile.firstName]
    .filter(Boolean)
    .join(" ");

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="lk-module user-profile">
      <div className="lk-main-usr-info">
        {profile.photo ? (
          <img src={profile.photo} alt="Аватарка" className="avatar" />
        ) : (
          <div className="avatar-placeholder">
            <p>
              {profile.firstName?.[0] || "?"}
              {profile.lastName?.[0] || "?"}
            </p>
          </div>
        )}
        <div className="lk-usr-name-phone">
          <p className="lk-text name">{fullName}</p>{" "}
          <p className="lk-text phone">+{profile.phone}</p>
        </div>
      </div>
      <p className="lk-info-field">Баланс: {profile.deposit / 100} ₽</p>
      <p className="lk-info-field">{profile.customFields[4].name}: {profile.customFields[4].value[0]}</p>
      <div className="lk-usr-inf-buttons">
        <button onClick={openEditForm} className="button edit-btn">
          Изменить
        </button>
        <button onClick={handleLogout} className="button logout-btn">
          Выйти
        </button>
      </div>
    </div>
  );
}

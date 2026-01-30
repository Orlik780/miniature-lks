import { useState, useEffect } from "react";
import { UserProfile } from "./UserProfile";
import { fetchProfile } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import { ButtonModule } from ".//ButtonModele";

export function Cabinet() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      if (data) {
        setProfile(data);
      } else {
        logout();
      }
      setLoading(false);
    };

    loadProfile();
  }, [logout]);

  if (loading) {
    return <div className="cabinet">Загрузка...</div>;
  }

  if (!profile) {
    return <div className="cabinet">Ошибка загрузки профиля</div>;
  }

  return (
    <div className="app-container">
      <ButtonModule />
      <h1>Личный кабинет</h1>
      <UserProfile profile={profile} />
    </div>
  );
}

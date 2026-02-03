import { useState, useEffect } from "react";
import { UserProfile } from "./UserProfile";
import { fetchProfile } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import { ButtonModule } from ".//ButtonModele";
import { ProfileEditForm } from "./ProfileEditForm";

export function Cabinet() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
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

  const loadProfile = async () => {
      const data = await fetchProfile();
      if (data) {
        setProfile(data);
      }
    };

  const openEditForm = () => {
    if (profile) {
      setIsEditOpen(true);
    }
  };

  if (loading) {
    return <div className="cabinet">Загрузка...</div>;
  }

  if (!profile) {
    return <div className="cabinet">Ошибка загрузки профиля</div>;
  }

  return (
    <div className="app-container cabinet-container">
      <h1>Личный кабинет</h1>
      <ButtonModule />
      <UserProfile profile={profile} openEditForm={openEditForm}/>

      <ProfileEditForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={{
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          middleName: profile.middleName,
          sex: profile.sex,
          photo: profile.photo,
        }}
        onSaveSuccess={loadProfile}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { UserProfile } from "./UserProfile";
import { fetchProfile, uploadBookings } from "../../utils/apiClient";
import type { UserProfileType, BookingsResponse } from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import { ButtonModule } from ".//ButtonModele";
import { ProfileEditForm } from "./ProfileEditForm";
import { BookingsContainer } from "./BookingsContainer";
import { BookingHistory } from "./BookingHistory";

export function Cabinet() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [historyBookings, setHistoryBookings] =
    useState<BookingsResponse | null>(null);
  const [activeBookings, setActiveBookings] = useState<BookingsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const profileData = await fetchProfile();
        if (profileData) {
          setProfile(profileData);
        } else {
          logout();
          return;
        }

        const activeBookingsData = await uploadBookings(false);
        if (activeBookingsData) {
          setActiveBookings(activeBookingsData);
        }

        const historyBookingsData = await uploadBookings(true);
        if (historyBookingsData) {
          setHistoryBookings(historyBookingsData);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [logout]);

  const loadProfile = async () => {
    const data = await fetchProfile();
    if (data) {
      setProfile(data);
    }
  };

  const loadBookings = async () => {
    const activeBookingsData = await uploadBookings(false);
    if (activeBookingsData) {
      setActiveBookings(activeBookingsData);
    }

    const historyBookingsData = await uploadBookings(true);
    if (historyBookingsData) {
      setHistoryBookings(historyBookingsData);
    }
  };

  const openEditForm = () => {
    if (profile) {
      setIsEditOpen(true);
    }
  };

  const openBookingsHistory = () => {
    if (profile) {
      setIsBookingHistoryOpen(true);
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

      <UserProfile profile={profile} openEditForm={openEditForm} />
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

      <BookingsContainer
        activeBookings={activeBookings}
        historyBookings={historyBookings}
        openHistory={openBookingsHistory}
        loadBookings={loadBookings}
      />
      <BookingHistory
        isOpen={isBookingHistoryOpen}
        onClose={() => setIsBookingHistoryOpen(false)}
        historyBookings={historyBookings}
      />
    </div>
  );
}

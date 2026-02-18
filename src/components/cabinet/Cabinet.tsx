import { useState, useEffect } from "react";
import { UserProfile } from "./UserProfile";
import {
  apiFetchProfile,
  apiFetchBookings,
  apiFetchSubscriptions,
} from "../../utils/apiClient";
import type {
  UserProfileType,
  BookingsResponse,
  SubscriptionResponse,
  Subscription,
} from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";
import { ButtonModule } from ".//ButtonModele";
import { ProfileEditForm } from "./ProfileEditForm";
import { BookingsContainer } from "./BookingsContainer";
import { BookingHistory } from "./BookingHistory";
import { SubscriptionsContainer } from "./SubscriptionsContainer";
import { SubscriptionInformation } from "./SubscriptionInformation";
import { BuySupscription } from "./BuySubscription";
import { Advertisement } from "./Advertisement";

export function Cabinet() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [historyBookings, setHistoryBookings] =
    useState<BookingsResponse | null>(null);
  const [activeBookings, setActiveBookings] = useState<BookingsResponse | null>(
    null,
  );
  const [userSubscriptions, setUserSubscriptions] =
    useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);
  const [isSubscriptionInfoOpen, SetSubscriptionInfoOpen] = useState(false);
  const [currenSub, SetCurrenSub] = useState<Subscription | null>(null);
  const [currenSubName, SetCurrenSubName] = useState<string>("Абонемент");
  const [isOpenBuySub, setOpenBuySub] = useState<boolean>(false);
  const { logout } = useAuth();

  /*useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const profileData = await apiFetchProfile();
        if (profileData) {
          setProfile(profileData.data);
        } else {
          logout();
          return;
        }

        const activeBookingsData = await apiFetchBookings(false);
        if (activeBookingsData) {
          setActiveBookings(activeBookingsData.data);
        }

        const historyBookingsData = await apiFetchBookings(true);
        if (historyBookingsData) {
          setHistoryBookings(historyBookingsData.data);
        }

        const userSubscriptionsData = await apiFetchSubscriptions();
        if (userSubscriptionsData.data) {
          setUserSubscriptions(userSubscriptionsData.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [logout]);*/

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [profileRes, activeRes, historyRes, subsRes] = await Promise.all([
          apiFetchProfile(),
          apiFetchBookings(false),
          apiFetchBookings(true),
          apiFetchSubscriptions(),
        ]);

        if (!isMounted) return;

        if (!profileRes?.data) {
          logout();
          return;
        }

        setProfile(profileRes.data);
        setActiveBookings(activeRes?.data || null);
        setHistoryBookings(historyRes?.data || null);
        setUserSubscriptions(subsRes?.data || null);
      } catch (error) {
        if (isMounted) console.error("Ошибка загрузки:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const loadProfile = async () => {
    const data = await apiFetchProfile();
    if (data) {
      setProfile(data.data);
    }
  };

  const loadBookings = async () => {
    const [activeBookingsData, historyBookingsData, userSubscriptionsData] = await Promise.all([
      apiFetchBookings(false),
      apiFetchBookings(true),
      apiFetchSubscriptions(),
    ]);
    if (activeBookingsData) {
      setActiveBookings(activeBookingsData.data);
    }
    if (historyBookingsData) {
      setHistoryBookings(historyBookingsData.data);
    }
    if (userSubscriptionsData.data) {
      setUserSubscriptions(userSubscriptionsData.data);
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

  const openSubInfo = (sub: Subscription, subName: string) => {
    SetCurrenSub(sub);
    SetCurrenSubName(subName);
    SetSubscriptionInfoOpen(true);
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

      <SubscriptionsContainer
        UserSubscriptions={userSubscriptions}
        phone={profile.phone}
        openSubInfo={openSubInfo}
        openBuy={() => {
          setOpenBuySub(true);
        }}
      />
      <SubscriptionInformation
        isOpen={isSubscriptionInfoOpen}
        onClose={() => {
          SetSubscriptionInfoOpen(false);
        }}
        sub={currenSub}
        subName={currenSubName}
      />
      <BuySupscription
        isOpen={isOpenBuySub}
        onClose={() => {
          setOpenBuySub(false);
        }}
        phone={profile.phone}
      />

      <Advertisement />
    </div>
  );
}

import { getCookie } from "./cookies";
import { TENANT_KEY, API_BASE, SERV2} from "../consts/api";

export interface UserProfileType {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  middleName: string;
  sex: string;
  photo: string | null;
  phone: string;
  birthDate: string | null;
  deposit: number;
  trialUsed: boolean;
  withCard: boolean;
  loyaltyCard: string;
  clientCategory: { id: number; name: string };
  customFields: any[];
}

export interface SubscriptionAvailableStudios {
  id: string;
  name: string;
}

export interface SubscriptionAvailableTypes {
  id: string;
  name: string;
}

export interface SubscriptionAvailableDirections {
  id: string;
  name: string;
}

export interface Subscription {
  subscriptionId: string;
  name: string | null;
  cost: 0;
  type: string;
  status: string;
  purchaseDate: string;
  autoActivationDate: string | null;
  activationDate: string | null;
  expirationDate: string | null;
  holdUntil: string | null;
  validityDays: number;
  totalFreezeDays: number;
  freezingDays: number;
  freezeUsed: boolean;
  hasStudioLimitation: boolean;
  availableStudios: SubscriptionAvailableStudios[];
  hasTypeLimitation: boolean;
  availableTypes: SubscriptionAvailableTypes[];
  hasDirectionLimitation: boolean;
  availableDirections: SubscriptionAvailableDirections[];
  hasDayLimitation: boolean;
  hasTimeRangeLimitation: boolean;
  variant: string;
  visitsTotal: number;
  visitsLeft: number;
  timeLimitation: string;
  minutes: number;
  availableMinutes: number;
  duration: string;
  availableDays: string;
}

export interface SubscriptionResponse {
  content: Subscription[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface Studio {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface Grade {
  id: string;
  name: string;
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  grade?: Grade;
  bio?: string;
}

export interface Direction {
  id: number;
  name: string;
  description?: string | null;
  photo?: string | null;
  whatToTake?: string | null;
  photoWeb?: string | null;
  duration?: string | null;
}

export interface ExerciseType {
  id: number;
  name: string;
  color: string;
  format: string;
}

export interface Exercise {
  id: string;
  direction: Direction;
  type: ExerciseType;
  timeFrom: string;
  timeTo: string;
  clientsCount: number;
  maxClientsCount: number;
  girlsOnly: boolean;
  studio: Studio;
  room: Room;
  trainers: Trainer[];
  cancellationDeadline?: string | null;
}

export interface Booking {
  id: string;
  spot: number;
  paymentType: string;
  isCancelled: boolean;
  cancellationReason?: string | null;
  visitConfirmed: boolean;
  exercise?: Exercise;
  reviewRate?: number | null;
  reviewComment?: string | null;
  clientSubscriptionId?: string | null;
  clientOneTimeId?: string | null;
  cost: number;
  transactionStatus?: {
    transactionId: string;
    transactionStatus: string;
    cardPaymentStatus?: {
      paymentId: string;
      paymentUrl: string;
      status: string;
      originalStatus: string;
      errorCode?: string | null;
    } | null;
  } | null;
  cancellationDeadline: string;
}

export interface BookingsResponse {
  content: Booking[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface UpdateProfileData {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  photo: string | null;
  sex: string | null;
}

export const fetchProfile = async (): Promise<UserProfileType | null> => {
  const token = getCookie(`${TENANT_KEY}AuthToken`);
  if (!token) return null;

  try {
    const res = await fetch(
      `${API_BASE}/end-user/api/v1/${TENANT_KEY}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      throw new Error("Ошибка загрузки профиля");
    }

    return await res.json();
  } catch (err) {
    console.error("Не удалось загрузить профиль:", err);
    return null;
  }
};

export const updateProfile = async (
  data: UpdateProfileData,
): Promise<UserProfileType | null> => {
  const token = getCookie(`${TENANT_KEY}AuthToken`);
  if (!token) return null;

  try {
    const res = await fetch(
      `${API_BASE}/end-user/api/v1/${TENANT_KEY}/profile`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Ошибка обновления профиля");
    }

    return await res.json();
  } catch (err) {
    console.error("Не удалось обновить профиль:", err);
    return null;
  }
};

export const uploadProfilePhoto = async (
  file: File,
): Promise<string | null> => {
  const token = getCookie(`${TENANT_KEY}AuthToken`);
  if (!token) return null;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${API_BASE}/end-user/api/v1/${TENANT_KEY}/profile/photo`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Ошибка загрузки фотографии");
    }

    const result = await res.text();
    return result || null;
  } catch (err) {
    console.error("Не удалось загрузить фотографию:", err);
    return null;
  }
};

/*export const updateProfileWithPhoto = async (
  profileData: Omit<UpdateProfileData, "photo">,
  photoFile?: File
): Promise<UserProfile | null> => {
  try {
    let photoUrl: string | null = null;
    
    if (photoFile) {
      photoUrl = await uploadProfilePhoto(photoFile);
      if (!photoUrl) {
        throw new Error("Не удалось загрузить фотографию");
      }
    }

    const updatedProfile = await updateProfile({
      ...profileData,
      photo: photoUrl,
    });

    return updatedProfile;
  } catch (err) {
    console.error("Не удалось обновить профиль с фотографией:", err);
    return null;
  }
};*/

export const uploadBookings = async (
  includeCanceled: boolean,
): Promise<BookingsResponse | null> => {
  const token = getCookie(`${TENANT_KEY}AuthToken`);
  if (!token) return null;

  const url = includeCanceled
    ? `${API_BASE}/end-user/api/v2/${TENANT_KEY}/bookings/history?includeCanceled=true&size=1000`
    : `${API_BASE}/end-user/api/v2/${TENANT_KEY}/bookings?size=1000`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Ошибка загрузки занятий");
    }

    const result = await res.json();
    return result || null;
  } catch (err) {
    console.error("Не удалось загрузить занятия:", err);
    return null;
  }
};

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  const token = getCookie(`${TENANT_KEY}AuthToken`);
  if (!token) return false;

  const url = `${API_BASE}/end-user/api/v1/${TENANT_KEY}/bookings/${bookingId}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return false;
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Ошибка отмены записи");
    }

    return true;
  } catch (err) {
    console.error("Не удалось отменить запись:", err);
    return false;
  }
};

export const uploadSubscriptions =
  async (): Promise<SubscriptionResponse | null> => {
    const token = getCookie(`${TENANT_KEY}AuthToken`);
    if (!token) return null;

    const url = `${API_BASE}/end-user/api/v1/${TENANT_KEY}/subscriptions`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          return null;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка отмены записи");
      }

      const result = await res.json();
      return result || null;
    } catch (err) {
      console.error("Не удалось отменить запись:", err);
      return null;
    }
  };

  export const fetchSubscriptioName =
  async (subId: string, phone: string): Promise<string | null> => {

    const url = `${SERV2}/get_sub_name?phone=${phone}&subId=${subId}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          return null;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка получения названия абика");
      }

      const result = await res.json();
      return result.sertName || null;
    } catch (err) {
      console.error("Не получить название абика:", err);
      return null;
    }
  };

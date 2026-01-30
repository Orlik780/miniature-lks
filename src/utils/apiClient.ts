import { getCookie } from "./cookies";
import { TENANT_KEY, API_BASE } from "../consts/api";

export interface UserProfile {
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

export const fetchProfile = async (): Promise<UserProfile | null> => {
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

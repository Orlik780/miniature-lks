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

export interface UpdateProfileData {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  photo: string | null;
  sex: string | null;
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

export const updateProfile = async (
  data: UpdateProfileData
): Promise<UserProfile | null> => {
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
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Ошибка обновления профиля"
      );
    }

    return await res.json();
  } catch (err) {
    console.error("Не удалось обновить профиль:", err);
    return null;
  }
};

export const uploadProfilePhoto = async (
  file: File
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
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Ошибка загрузки фотографии"
      );
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
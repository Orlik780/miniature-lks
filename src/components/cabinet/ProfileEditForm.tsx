import React, { useState } from "react";
import { Modal } from "../UI/Modal";
import { uploadProfilePhoto, updateProfile } from "../../utils/apiClient";

interface ProfileEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    email: string | null;
    firstName: string;
    lastName: string;
    middleName: string;
    sex: string;
    photo: string | null;
  };
  onSaveSuccess: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: initialData.email || "",
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    middleName: initialData.middleName || "",
    sex: initialData.sex || "U",
    photo: initialData.photo || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0] || null;

      let photoUrl: string | null = "";

      if (file) {
        photoUrl = await uploadProfilePhoto(file);
        if (!photoUrl) {
          throw new Error("Не удалось загрузить фотографию");
        }
        setFormData((prev) => ({
          ...prev,
          ["photo"]: photoUrl ? photoUrl : "",
        }));
      }
    } catch (err) {
      console.error("Не удалось обновить профиль с фотографией:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updatedProfile = await updateProfile({
        email: formData.email.trim() || null,
        firstName: formData.firstName.trim() || null,
        lastName: formData.lastName.trim() || null,
        middleName: formData.middleName.trim() || null,
        sex: formData.sex || null,
        photo: formData.photo || null,
      });

      if (updatedProfile) {
        onSaveSuccess();
        onClose();
      } else {
        setError("Не удалось сохранить изменения");
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setError("Произошла ошибка при сохранении данных");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать профиль">
      <form onSubmit={handleSubmit} className="profile-edit-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group avatar-group">
          {formData.photo ? (
            <img src={formData.photo} alt="Аватарка" className="edit-avatar" />
          ) : (
            <div className="edit-avatar-placeholder">
              <p>
                {formData.firstName?.[0] || "?"}
                {formData.lastName?.[0] || "?"}
              </p>
            </div>
          )}
          <div className="button">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoChange}
              className="img-form-input"
            />
            <label htmlFor="photo-upload">Загрузить фото</label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Фамилия</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="input for-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Имя</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="input form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Отчество</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            className="input form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пол</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleInputChange}
            className="input form-select"
          >
            <option value="U">Не указан</option>
            <option value="M">Мужской</option>
            <option value="F">Женский</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="button btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="button btn-primary"
            disabled={saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

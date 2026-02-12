import { useState } from "react";
import type { Booking } from "../../utils/apiClient";
import { cancelBooking } from "../../utils/apiClient";

interface BookingProps {
  booking: Booking;
  active: boolean;
  loadBookings?: () => void;
}

export function BookingCard({ booking, active, loadBookings }: BookingProps) {
  const cancellationDeadline = new Date(booking.cancellationDeadline);
  const now = new Date();

  const [cancelStatus, setСancelStatus] = useState(0);
  const [cancelResult, setCancelResult] = useState(false);

  const booking_time = `${booking.exercise?.timeFrom.slice(8, 10)}.${booking.exercise?.timeFrom.slice(5, 7)}.${booking.exercise?.timeFrom.slice(0, 4)} ${booking.exercise?.timeFrom.slice(11, 16)}-${booking.exercise?.timeTo.slice(11, 16)}`;

  const handleCancelClick = async () => {
    const res = await cancelBooking(booking.id);
    setCancelResult(res);
  };
  return (
    <div className="booking-card">
      <div className="booking-info-container">
        <div className="booking-info">
          <label className="booking-info-label">{booking_time}</label>
          <label className="booking-info-label">
            {booking.exercise?.direction.name}
          </label>
          <label className="booking-info-label">
            {booking.exercise?.studio.name} {booking.exercise?.room.name}
          </label>
        </div>
        <div className="status-info">
          <label className="booking-info-label">
            {active
              ? booking.transactionStatus?.transactionStatus === "PAID"
                ? booking.paymentType == "SUBSCRIPTION"
                  ? "Абонемент"
                  : booking.cost / 100 + " ₽"
                : "Не оплачено"
              : booking.isCancelled
                ? "отменено"
                : booking.paymentType == "SUBSCRIPTION"
                  ? "Абонемент"
                  : booking.cost / 100 + " ₽"}
          </label>
        </div>
      </div>
      <div className="trainer-info-container">
        {booking.exercise?.trainers[0] && (
          <label className="booking-info-label">
            {booking.exercise?.trainers[0].firstName}{" "}
            {booking.exercise?.trainers[0].lastName}
          </label>
        )}
        {booking.exercise?.trainers[0] && (
          <label className="booking-info-label">
            {booking.exercise?.trainers[0].grade?.name}
          </label>
        )}
      </div>
      {active ? (
        cancellationDeadline > now ? (
          <>
            {cancelStatus === 0 ? (
              <button
                className="button"
                onClick={() => {
                  setСancelStatus(1);
                }}
              >
                Отменить
              </button>
            ) : (
              <>
                {cancelStatus === 1 ? (
                  <div>
                    <label>Отменить</label>
                    <button
                      className="button"
                      onClick={() => {
                        setСancelStatus(0);
                      }}
                    >
                      Нет
                    </button>
                    <button
                      className="button"
                      onClick={() => {
                        setСancelStatus(2);
                        handleCancelClick();
                      }}
                    >
                      Да
                    </button>
                  </div>
                ) : (
                  <>
                    <label>
                      {cancelResult
                        ? "Запись успешно отменена"
                        : "Во время отмены записи произошла ошибка"}
                    </label>
                    <button
                      className="button"
                      onClick={() => {
                        if (loadBookings) loadBookings();
                      }}
                    >
                      Ок
                    </button>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <label className="lk-info-field">
            Отмена записи возможно только за 24 часа
          </label>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

import type { Booking } from "../../utils/apiClient";

interface BookingProps {
  booking: Booking;
  active: boolean;
}

export function BookingCard({ booking, active }: BookingProps) {
  const booking_time = `${booking.exercise?.timeFrom.slice(8, 10)}.${booking.exercise?.timeFrom.slice(5, 7)}.${booking.exercise?.timeFrom.slice(0, 4)} ${booking.exercise?.timeFrom.slice(11, 16)}-${booking.exercise?.timeTo.slice(11, 16)}`;
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
                ? booking.cost / 100 + " ₽"
                : "Не оплачено"
              : booking.isCancelled
                ? "отменено"
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
    </div>
  );
}

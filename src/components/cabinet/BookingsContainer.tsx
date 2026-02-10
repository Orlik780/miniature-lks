import type { BookingsResponse } from "../../utils/apiClient";
import { BookingCard } from "./BookingCard";

interface BookingsContainerProps {
  activeBookings: BookingsResponse | null;
  historyBookings: BookingsResponse | null;
  openHistory: () => void;
  loadBookings: () => void;
}

export function BookingsContainer({
  activeBookings,
  historyBookings,
  openHistory,
  loadBookings
}: BookingsContainerProps) {
  if (
    (!activeBookings || activeBookings.content.length === 0) &&
    (!historyBookings || historyBookings.content.length === 0)
  )
    return null;
  return (
    <div className="lk-module booking-active-container">
      {activeBookings && activeBookings.content.length > 0 && (
        <div className="booking-container">
          <label>Активные записи</label>
          {activeBookings.content.map((book) => (
            <BookingCard key={book.id} booking={book} active={true} loadBookings={loadBookings}/>
          ))}
        </div>
      )}
      {historyBookings && historyBookings.content.length > 0 && (
        <button className="button" onClick={openHistory}>
          Прошедшие записи
        </button>
      )}
    </div>
  );
}

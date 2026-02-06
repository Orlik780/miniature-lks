import React, { useState } from "react";
import { Modal } from "../UI/Modal";
import type { BookingsResponse, Booking } from "../../utils/apiClient";
import { BookingCard } from "./BookingCard";

interface BookingHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  historyBookings: BookingsResponse | null;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  isOpen,
  onClose,
  historyBookings,
}) => {
  const [bookingsType, setBookingsType] = useState("visited");

  if (!isOpen || !historyBookings || historyBookings.content.length == 0)
    return null;

  const filteredBookings = historyBookings.content.filter(
    (booking: Booking) => {
      if (bookingsType === "cancelled") {
        return booking.isCancelled === true;
      } else {
        return booking.isCancelled === false;
      }
    },
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Прошедшие записи">
      <div className="booking-history-container">
        <div>
          <button
            className="button"
            onClick={() => setBookingsType("visited")}
            style={{
              borderColor: bookingsType === "visited" ? "#7161ff" : "#cdcbe0",
            }}
          >
            Посещённые
          </button>
          <button
            className="button"
            onClick={() => setBookingsType("cancelled")}
            style={{
              borderColor: bookingsType === "cancelled" ? "#7161ff" : "#cdcbe0",
            }}
          >
            Отмененные
          </button>
        </div>
        {filteredBookings.length > 0 ? (
          <div className="booking-container">
            {filteredBookings.map((book) => (
              <BookingCard key={book.id} booking={book} active={false} />
            ))}
          </div>
        ) : (
          <div>
            {bookingsType === "visited"
              ? "Нет посещённых записей"
              : "Нет отменённых записей"}
          </div>
        )}
      </div>
    </Modal>
  );
};

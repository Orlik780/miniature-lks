import { useEffect, useState, useRef } from "react";
import { fetchSubscriptioName } from "../../utils/apiClient";
import type { Subscription } from "../../utils/apiClient";

interface SubscriptionsContainerProps {
  subscription: Subscription;
  phone: string;
  openSubInfo: (sub: Subscription, subName: string) => void;
}

export function SubscroptionCard({
  subscription,
  phone,
  openSubInfo,
}: SubscriptionsContainerProps) {
  const [subscriptionName, setSubscriptionName] = useState("Абонемент");
  const [tilt, setTilt] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const subscriptionData = await fetchSubscriptioName(
        subscription.subscriptionId,
        phone,
      );
      if (subscriptionData) {
        setSubscriptionName(subscriptionData);
      }
    };
    loadData();
  }, [subscription.subscriptionId, phone]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const diffX = e.clientX - centerX;
    const percentageX = diffX / (cardRect.width / 2);

    const maxTilt = 10;
    setTilt(percentageX * maxTilt);
  };

  const handleMouseLeave = () => {
    setTilt(0);
  };

  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const getExpirationInfo = () => {
    if (subscription.expirationDate) {
      const formattedDate = formatDate(subscription.expirationDate);
      return formattedDate ? `Действует до: ${formattedDate}` : null;
    }

    if (subscription.availableDays) {
      return `Осталось дней: ${subscription.availableDays}`;
    }

    return null;
  };

  const getVisitsInfo = () => {
    if (subscription.visitsTotal > 0) {
      return `Посещений осталось: ${subscription.visitsLeft} из ${subscription.visitsTotal}`;
    }
    return null;
  };

  return (
    <div className="subscription-card-main-container" onClick={() => {openSubInfo(subscription, subscriptionName)}}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateY(${tilt}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
        className="subscription-card-animated"
      >
        <h3 className="subscription-h3">{subscriptionName}</h3>

        {getExpirationInfo() && (
          <div className="expiration-info">{getExpirationInfo()}</div>
        )}

        {getVisitsInfo() && (
          <div
            style={{
              color: subscription.visitsLeft > 0 ? "#2b6cb0" : "#e53e3e",
            }}
            className="visits-info"
          >
            {getVisitsInfo()}
          </div>
        )}

        <div
          style={{
            backgroundColor:
              subscription.status === "ACTIVE"
                ? "rgba(40, 167, 69, 0.1)"
                : "rgba(220, 53, 69, 0.1)",
            color: subscription.status === "ACTIVE" ? "#28a745" : "#dc3545",
          }}
          className="status-badge"
        >
          {subscription.status === "ACTIVE" ? "Активен" : "Истек"}
        </div>
      </div>
    </div>
  );
}

import type { SubscriptionResponse } from "../../utils/apiClient";
import { SubscroptionCard } from "./SubscroptionCard";
import type { Subscription } from "../../utils/apiClient";

interface SubscriptionsContainerProps {
  UserSubscriptions: SubscriptionResponse | null;
  phone: string;
  openSubInfo: (sub: Subscription, subName: string) => void;
}

export function SubscriptionsContainer({
  UserSubscriptions,
  phone,
  openSubInfo
}: SubscriptionsContainerProps) {
  if (!UserSubscriptions || UserSubscriptions.content.length === 0) return null;

  return (
    <div className="lk-module booking-active-container">
      {UserSubscriptions.content.map((sub) => (
        <SubscroptionCard
          key={sub.subscriptionId}
          subscription={sub}
          phone={phone}
          openSubInfo={openSubInfo}
        />
      ))}
    </div>
  );
}

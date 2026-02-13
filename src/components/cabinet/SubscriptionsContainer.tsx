import type { SubscriptionResponse } from "../../utils/apiClient";
import { SubscroptionCard } from "./SubscroptionCard";
import type { Subscription } from "../../utils/apiClient";

interface SubscriptionsContainerProps {
  UserSubscriptions: SubscriptionResponse | null;
  phone: string;
  openSubInfo: (sub: Subscription, subName: string) => void;
  openBuy: () => void;
}

export function SubscriptionsContainer({
  UserSubscriptions,
  phone,
  openSubInfo,
  openBuy
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
      <button className="button" onClick={() => {openBuy()}}>Купить абонимент</button>
    </div>
  );
}

import { useState } from "react";
import { Modal } from "../UI/Modal";
import sub_krik from "../../assets/dr_krik.png";
import sub_en5 from "../../assets/en5.jpg";
import sub_en25 from "../../assets/en25.jpg";
import { buySubscroption } from "../../utils/apiClient";

interface BuySubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

export function BuySupscription({
  isOpen,
  onClose,
  phone,
}: BuySubscriptionProps) {
  const [selectSub, setSelectSub] = useState<string | null>(null);
  const [cost, setCost] = useState<number | null>(null);

  const buySub = async () => {
    if (selectSub === null) return;
    const url = await buySubscroption(selectSub, phone);
    if (url) {
       window.location.href = url;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Абонементы">
      <>
        <div className="subBuyContainer">
          <div
            onClick={() => {
              setCost(19800)
              setSelectSub("dfa72adf-233b-4285-8d69-e5eab4234fbe");
            }}
            className="subBuyIMgContainer"
            style={{ borderColor: selectSub == "dfa72adf-233b-4285-8d69-e5eab4234fbe" ? "#7270ff" : "#e9ecef" }}
          >
            <img src={sub_en5} className="subImg" alt="en5" />
          </div>
          <div
            onClick={() => {
              setCost(10)
              setSelectSub("9af17995-33cb-482f-8532-b5da7f8b5eb4");
            }}
            className="subBuyIMgContainer"
            style={{ borderColor: selectSub == "9af17995-33cb-482f-8532-b5da7f8b5eb4" ? "#7270ff" : "#e9ecef" }}
          >
            <img src={sub_krik} className="subImg" alt="krik" />
          </div>
          <div
            onClick={() => {
              setCost(97000)
              setSelectSub("9fb759fd-f70c-4395-84e7-57716df97e14");
            }}
            className="subBuyIMgContainer"
            style={{ borderColor: selectSub == "9fb759fd-f70c-4395-84e7-57716df97e14" ? "#7270ff" : "#e9ecef" }}
          >
            <img src={sub_en25} className="subImg" alt="en25" />
          </div>
        </div>
        <button
          className="button"
          onClick={() => {
            buySub();
          }}
        >{cost !== null ? `Купить за ${cost}₽`:`Купить`}</button>
      </>
    </Modal>
  );
}

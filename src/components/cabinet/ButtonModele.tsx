import tgLogo from "../../assets/telegram.svg";
import vkLogo from "../../assets/vk.svg";
import giftLogo from "../../assets/gift-card.png";

export function ButtonModule() {
  return (
    <div className="nav-links lk-module buttons-div">
      <a href="https://vk.com/padlhub" target="_blank">
        <img src={vkLogo} className="logo" alt="Vk" />
      </a>

      <a href="https://padlhub.ru/giftcard" target="_blank">
        <img src={giftLogo} className="logo" alt="giftcard" />
      </a>

      <a href="https://t.me/padel_academyF" target="_blank">
        <img src={tgLogo} className="logo" alt="telega" />
      </a>
    </div>
  );
}

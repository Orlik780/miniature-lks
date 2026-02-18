import { useEffect, useState } from "react";
import { apiGetAdvertisement } from "../../utils/apiClient";
import type { AdvertisementType } from "../../utils/apiClient";

export function Advertisement() {
  const [advertisement, setAdvertisement] = useState<AdvertisementType | null>(
    null,
  );

  const getAdvertisement = async () => {
    const advertisementData = await apiGetAdvertisement();
    if (advertisementData.data) {
      setAdvertisement(advertisementData.data);
    }
  };

  useEffect(() => {
    getAdvertisement();
  }, []);

  return (
    <div className="lk-module">
      {advertisement ? (
        <a className="advertisement" href={advertisement?.href}>
          <img src={advertisement?.imgUrl} alt="Реклама" className="add-img" />
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

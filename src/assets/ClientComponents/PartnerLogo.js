import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "./PartnerLogo.css";

const PartnerLogo = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const storage = getStorage();
      const logosRef = ref(storage, "PartnerLogo");
      try {
        const result = await listAll(logosRef);
        const urls = await Promise.all(
          result.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching logo URLs: ", error);
      }
    };
    fetchImageUrls();
  }, []);

  return (
    <div className="partner-logos">
      <h2>Trusted by Our Clients</h2>
      <div className="logos-animation">
        {imageUrls.map((url, index) => (
          <div className="logo-container" key={index}>
            <img src={url} alt={`Logo ${index}`} className="logo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogo;

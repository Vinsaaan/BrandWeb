import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "./AdminEditPartnerLogo.css"; // Ensure your CSS file path is correct
import EditPartnerLogo from "./EditPartnerLogo"; // Adjust path as necessary

const AdminEditPartnerLogo = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false); // State to control the popup display

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

  // Function to handle opening the popup
  const handleOpenPopup = () => {
    setShowEditPopup(true);
  };

  return (
    <div className="partner-logos">
      {/* Clicking the title now also triggers the popup */}
      <h2 onClick={handleOpenPopup}>Trusted by Our Clients</h2>
      <div className="logos-animation">
        {imageUrls.map((url, index) => (
          <div className="logo-container" key={index} onClick={handleOpenPopup}>
            <img src={url} alt={`Logo ${index}`} className="logo" />
          </div>
        ))}
      </div>
      {showEditPopup && (
        <EditPartnerLogo handleClose={() => setShowEditPopup(false)} />
      )}
      {/* Currently, the button is left with no functionality as per your request */}
      <button className="edit-logos-btn" disabled>
        Edit Logos
      </button>
    </div>
  );
};

export default AdminEditPartnerLogo;

import React, { useEffect, useState, useCallback } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./EditPartnerLogo.css";

const EditPartnerLogo = ({ handleClose, setPreviewLogo }) => {
  const [logos, setLogos] = useState([]);
  const [file, setFile] = useState(null);
  const db = getFirestore();
  const storage = getStorage();

  const fetchLogos = useCallback(async () => {
    const logosCollectionRef = collection(db, "PartnerLogo");
    const logoDocs = await getDocs(logosCollectionRef);
    const logosData = logoDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLogos(logosData);
  }, [db]); // Dependencies should be external values used inside useCallback

  useEffect(() => {
    fetchLogos();
  }, [fetchLogos]); // Now fetchLogos is a stable function

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadLogo = async () => {
    if (file) {
      const fileRef = ref(storage, `PartnerLogo/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, "PartnerLogo"), { url });
      fetchLogos(); // Refresh the logos after upload
    }
  };

  const deleteLogo = async (logoId) => {
    await deleteDoc(doc(db, "PartnerLogo", logoId));
    fetchLogos(); // Refresh the logos after deletion
  };

  const handlePreview = () => {
    if (logos.length > 0) {
      setPreviewLogo(logos[0].url);
    }
    handleClose(); // Close the popup
  };

  return (
    <div className="edit-partner-logo-backdrop">
      <div className="edit-partner-logo-popup">
        <div className="edit-partner-logo-content">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          <h2>Edit Partner Logos</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadLogo}>Upload Logo</button>
          <div className="logos-container">
            {logos.map((logo) => (
              <div key={logo.id} className="logo-item">
                <img src={logo.url} alt="Logo" />
                <img
                  src="Delete.png"
                  alt="Delete"
                  className="delete-logo"
                  onClick={() => deleteLogo(logo.id)}
                />
              </div>
            ))}
          </div>
          <button className="preview-btn" onClick={handlePreview}>
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPartnerLogo;

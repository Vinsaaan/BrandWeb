import React, { useState } from "react";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { app } from "../../../firebase-config";
import deleteIcon from "../../image/AdminComponents/Delete.png";
import "./TrackNumberList.css";
import AreYouSureDelete from "../AreYouSureDelete";

function TrackNumberList({ trackingData, setTrackingData }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleDelete = (productId, trackingNumber) => {
    setSelectedItem({ productId, trackingNumber });
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    const db = getFirestore(app);
    const productRef = doc(db, "Product", selectedItem.productId);

    const productDoc = await getDoc(productRef);
    if (productDoc.exists()) {
      // Extract the current array of tracking numbers (which are objects now)
      const currentTrackingNumbers = productDoc.data().TrackingNumbers || [];
      // Filter out the tracking number to delete
      const updatedTrackingNumbers = currentTrackingNumbers.filter(
        (tn) => tn.trackingNumber !== selectedItem.trackingNumber
      );

      // Update the Firestore document with the new array
      await updateDoc(productRef, {
        TrackingNumbers: updatedTrackingNumbers,
      });

      // Update local state to reflect the change
      const updatedTrackingData = trackingData.map((product) => {
        if (product.id === selectedItem.productId) {
          return { ...product, TrackingNumbers: updatedTrackingNumbers };
        }
        return product;
      });
      setTrackingData(updatedTrackingData);
    } else {
      console.log("Document does not exist!");
    }

    setShowDeletePopup(false);
    setSelectedItem(null);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedItem(null);
  };

  // Flatten the tracking numbers for display
  const flattenedTrackingNumbers = trackingData.flatMap((product) =>
    (product.TrackingNumbers || []).map((trackingNumber) => ({
      ...product,
      trackingNumber,
    }))
  );

  return (
    <div className="track-number-table-container">
      <table className="track-number-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tracking Number</th>
            <th>Created Date</th> {/* Updated label */}
            <th>Action</th> {/* Kept as is, implying deletion is the action */}
          </tr>
        </thead>
        <tbody>
          {flattenedTrackingNumbers.map((item, index) => (
            <tr key={`${item.id}-${index}`}>
              <td>{index + 1}</td>
              <td>{item.trackingNumber.trackingNumber}</td>
              <td>{item.trackingNumber.createdAt}</td>{" "}
              {/* Ensure this displays the date */}
              <td>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={() =>
                    handleDelete(item.id, item.trackingNumber.trackingNumber)
                  }
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeletePopup && selectedItem && (
        <AreYouSureDelete
          item={selectedItem.trackingNumber}
          onDelete={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default TrackNumberList;

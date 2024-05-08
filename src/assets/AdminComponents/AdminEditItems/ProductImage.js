import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import deleteIcon from "../../image/AdminComponents/Delete.png";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../../firebase-config";
import "./ProductImage.css";

const ProductImage = ({ productId, imageUrl, setImageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState(imageUrl || "");
  const storage = getStorage(app);

  const uploadImageToStorage = useCallback(
    async (file) => {
      const storageRef = ref(
        storage,
        `ProductImages/${productId}/${file.name}`
      );
      try {
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        setImageUrl(downloadUrl);
      } catch (error) {
        console.error("Error uploading new image:", error);
      }
    },
    [storage, productId, setImageUrl]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setPreviewUrl(reader.result);
        uploadImageToStorage(file);
      };

      reader.readAsDataURL(file);
    },
    [uploadImageToStorage]
  );

  const handleDelete = (event) => {
    event.stopPropagation();
    setPreviewUrl("");
    setImageUrl("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <div className="product-image-container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {!previewUrl ? (
          <p>
            Upload Product Image
            <br />
            500px x 500px
          </p>
        ) : (
          <div className="image-container">
            <img alt="Preview" src={previewUrl} className="image-preview" />
            <button
              className="delete-button"
              onClick={(event) => handleDelete(event)}
            >
              <img src={deleteIcon} alt="Delete" className="delete-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImage;

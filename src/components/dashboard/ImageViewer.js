import React from "react";
import { Modal, Image, Icon } from "semantic-ui-react";
import "./ImageViewer.css";

const ImageViewer = ({ open, onClose, imageUrl, fileName }) => {
  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:5000/${url}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="image-viewer-modal"
      closeIcon={<Icon name="close" />}
    >
      <Modal.Header>
        <Icon name="image outline" />
        {fileName}
      </Modal.Header>
      <Modal.Content>
        <div className="image-container">
          <Image
            src={getFullImageUrl(imageUrl)}
            fluid
            onError={(e) => {
              console.error("Image viewer load error:", e);
              console.log("Failed URL:", e.target.src);
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default ImageViewer;

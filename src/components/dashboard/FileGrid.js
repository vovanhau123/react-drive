import React, { useState, useMemo } from "react";
import { Grid, Icon, Image, Dropdown } from "semantic-ui-react";
import { formatFileSize, formatDate } from "../../utils/fileUtils";
import ImageViewer from "./ImageViewer";
import "./FileGrid.css";

const FileGrid = ({
  items,
  onItemClick,
  searchQuery,
  sortBy,
  onDownload,
  onDownloadFolder,
  onShare,
  onStar,
  onDelete,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "modified":
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          case "size":
            return (b.size || 0) - (a.size || 0);
          default:
            return 0;
        }
      });
  }, [items, searchQuery, sortBy]);

  const isImageFile = (type) => {
    if (!type) return false;
    return type.startsWith("image/");
  };

  const handleFolderClick = (folder, e) => {
    e.stopPropagation();
    console.log("Folder clicked:", folder);
    if (folder && folder.id) {
      onItemClick(folder);
    } else {
      console.error("Invalid folder:", folder);
    }
  };

  const handleImageClick = (image) => {
    console.log("Opening image:", image);
    setSelectedImage(image);
  };

  const handleFileClick = (file, e) => {
    e.stopPropagation();
    console.log("Opening file:", file);
    onItemClick(file);
  };

  const handleDownload = (item) => {
    if (item.type === "folder") {
      onDownloadFolder?.(item);
    } else {
      onDownload?.(item);
    }
  };

  const handleShare = (item, e) => {
    e.stopPropagation();
    onShare(item);
  };

  const handleStar = async (item, e) => {
    e.stopPropagation();
    try {
      await onStar(item);
    } catch (error) {
      console.error("Star error:", error);
    }
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    try {
      await onDelete(item);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const renderItemPreview = (item) => {
    console.log("Rendering item:", item);
    if (!item || !item.type) return null;

    if (item.type === "folder" || item.isFolder) {
      return (
        <div
          className="preview-icon"
          style={{ cursor: "pointer" }}
          onClick={(e) => handleFolderClick(item, e)}
        >
          <Icon name="folder" size="huge" />
        </div>
      );
    }

    if (isImageFile(item.type)) {
      const imageUrl = item.path.startsWith("http")
        ? item.path
        : `https://5c7b-42-117-143-208.ngrok-free.app/${item.path}`;

      return (
        <div className="preview-wrapper" onClick={() => handleImageClick(item)}>
          <div className="preview-image">
            <Image
              src={imageUrl}
              alt={item.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
          <div className="hover-overlay">
            <Icon name="zoom" size="large" />
            <span>View Image</span>
          </div>
        </div>
      );
    }

    return (
      <div className="preview-icon" onClick={(e) => handleFileClick(item, e)}>
        <Icon name="file" size="huge" />
      </div>
    );
  };

  const renderItemActions = (item) => (
    <div className="item-actions">
      <Dropdown
        icon="ellipsis vertical"
        className="item-menu"
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown.Menu direction="left">
          <Dropdown.Item
            icon="download"
            text="Download"
            className="menu-item-download"
            onClick={() => handleDownload(item)}
          />
          <Dropdown.Item
            icon="share"
            text="Share"
            className="menu-item-share"
            onClick={(e) => handleShare(item, e)}
          />
          <Dropdown.Item
            icon={item.isStarred ? "star" : "star outline"}
            text={item.isStarred ? "Remove from starred" : "Add to starred"}
            className="menu-item-star"
            onClick={(e) => handleStar(item, e)}
          />
          <Dropdown.Divider />
          <Dropdown.Item
            icon="trash"
            text="Delete"
            className="menu-item-delete"
            onClick={(e) => handleDelete(item, e)}
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );

  return (
    <>
      <Grid columns={4} className="file-grid">
        {filteredAndSortedItems.map((item) => (
          <Grid.Column key={item.id} className="grid-column">
            <div className="grid-item">
              <div className="item-preview">
                {renderItemPreview(item)}
                {renderItemActions(item)}
              </div>
              <div className="item-info">
                <div
                  className="item-name"
                  title={item.name}
                  onClick={(e) =>
                    item.type === "folder" ? handleFolderClick(item, e) : null
                  }
                  style={item.type === "folder" ? { cursor: "pointer" } : {}}
                >
                  {item.name}
                </div>
                <div className="item-details">
                  {item.type === "folder" ? (
                    <span>{item.itemCount || 0} items</span>
                  ) : (
                    <span>{formatFileSize(item.size)}</span>
                  )}
                  <span className="dot">•</span>
                  <span>{formatDate(item.updatedAt)}</span>
                </div>
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>

      {selectedImage && (
        <ImageViewer
          open={true}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.path}
          fileName={selectedImage.name}
        />
      )}
    </>
  );
};

export default FileGrid;

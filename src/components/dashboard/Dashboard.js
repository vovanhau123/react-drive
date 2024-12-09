import React, { useState, useEffect } from "react";
import {
  Container,
  Menu,
  Icon,
  Button,
  Input,
  Dropdown,
} from "semantic-ui-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import FileGrid from "./FileGrid";
import FileList from "./FileList";
import UploadModal from "./UploadModal";
import NewFolderModal from "./NewFolderModal";
import ShareModal from "./ShareModal";
import SharedFiles from "./SharedFiles";
import StarredFiles from "./StarredFiles";
import TrashFiles from "./TrashFiles";
import MobileNav from "./MobileNav";
import "./Dashboard.css";
import folderService from "../../services/folderService";
import shareService from "../../services/shareService";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const [view, setView] = useState("grid");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const [sortBy, setSortBy] = useState("name");
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("my-drive");
  const [storageInfo] = useState({
    used: 4.5,
    total: 10,
    usedFormatted: "4.5 GB",
    totalFormatted: "10 GB",
  });
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  const loadFolderContents = async (folderId = null) => {
    try {
      setLoading(true);
      const data = await folderService.getFolderContents(folderId);
      console.log("Folder contents:", data);

      const formattedFolders = (data.subfolders || []).map((folder) => ({
        ...folder,
        type: "folder",
        isFolder: true,
      }));

      setCurrentFolder(data.folder || null);
      setFolders(formattedFolders);
      setFiles(data.files || []);
    } catch (error) {
      console.error("Load folder error:", error);
      showToast("Failed to load folder contents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolderContents();
  }, []);

  const handleCreateFolder = async (folderName) => {
    try {
      const newFolder = await folderService.createFolder(
        folderName,
        currentFolder?.id
      );
      showToast("Folder created successfully!", "success");
      loadFolderContents(currentFolder?.id);
      setNewFolderModalOpen(false);
    } catch (error) {
      showToast("Failed to create folder", "error");
    }
  };

  const handleUpload = async (files) => {
    try {
      setUploadModalOpen(false);
      const result = await folderService.uploadFiles(
        currentFolder?.id,
        files,
        (progress) => {
          // Update upload progress
          console.log("Upload progress:", progress);
        }
      );
      showToast("Files uploaded successfully!", "success");
      loadFolderContents(currentFolder?.id);
    } catch (error) {
      showToast("Failed to upload files", "error");
    }
  };

  const handleItemClick = async (item) => {
    try {
      console.log("Item clicked:", item);

      if (item.type === "folder" || item.isFolder) {
        console.log("Opening folder:", item);
        setCurrentPath(`${currentPath}${item.name}/`);
        await loadFolderContents(item.id);
        setCurrentFolder(item);
      } else if (item.type.startsWith("image/")) {
        return;
      } else {
        setSelectedItem(item);
        setShareModalOpen(true);
      }
    } catch (error) {
      console.error("Error handling item click:", error);
      showToast("Failed to open item", "error");
    }
  };

  const handleNavigateUp = async () => {
    if (currentPath === "/") return;

    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.pop(); // Xóa folder hiện tại
    const parentPath = pathParts.length ? `/${pathParts.join("/")}/` : "/";
    setCurrentPath(parentPath);

    // Nếu về root
    if (parentPath === "/") {
      await loadFolderContents();
    } else {
      // Tìm parent folder ID
      const parentFolder = folders.find(
        (f) => f.name === pathParts[pathParts.length - 1]
      );
      if (parentFolder) {
        await loadFolderContents(parentFolder.id);
      }
    }
  };

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const handleShare = async (shareSettings) => {
    try {
      if (!selectedItem) return;

      const result = await shareService.shareItem(
        selectedItem.id,
        shareSettings
      );

      showToast("Item shared successfully!", "success");
      setShareModalOpen(false);

      // Nếu đang ở trong folder, reload lại nội dung
      if (currentFolder) {
        await loadFolderContents(currentFolder.id);
      }
    } catch (error) {
      console.error("Share error:", error);
      showToast(
        error.response?.data?.message || "Failed to share item",
        "error"
      );
    }
  };

  const handleDownload = async (item) => {
    try {
      if (!item || !item.id) {
        showToast('Invalid file', 'error');
        return;
      }

      showToast('Starting download...', 'info');
      const response = await folderService.downloadItem(item.id);
      
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      
      showToast('Download completed!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast(error.message || 'Failed to download file', 'error');
    }
  };

  const handleDownloadFolder = async (folder) => {
    try {
      if (!folder || !folder.id) {
        showToast('Invalid folder', 'error');
        return;
      }

      showToast('Starting folder download...', 'info');
      const response = await folderService.downloadFolder(folder.id);
      
      const blob = new Blob([response.data], { 
        type: 'application/zip'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folder.name}.zip`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      
      showToast('Folder download completed!', 'success');
    } catch (error) {
      console.error('Download folder error:', error);
      showToast(error.message || 'Failed to download folder', 'error');
    }
  };

  const handleStar = async (item) => {
    try {
      await folderService.toggleStar(item.id);
      loadFolderContents(currentFolder?.id);
      showToast(
        item.isStarred ? "Removed from starred" : "Added to starred",
        "success"
      );
    } catch (error) {
      showToast("Failed to update star status", "error");
    }
  };

  const handleDelete = async (item) => {
    try {
      await folderService.deleteItem(item.id);
      loadFolderContents(currentFolder?.id);
      showToast("Item moved to trash", "success");
    } catch (error) {
      showToast("Failed to delete item", "error");
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case "shared":
        return (
          <SharedFiles view={view} searchQuery={searchQuery} sortBy={sortBy} />
        );
      case "starred":
        return (
          <StarredFiles view={view} searchQuery={searchQuery} sortBy={sortBy} />
        );
      case "trash":
        return (
          <TrashFiles view={view} searchQuery={searchQuery} sortBy={sortBy} />
        );
      default:
        return (
          <div className="content-body">
            {loading ? (
              <div className="loading-state">
                <Icon name="spinner" loading />
                Loading...
              </div>
            ) : view === "grid" ? (
              <FileGrid
                items={[
                  ...folders.map((f) => ({
                    ...f,
                    type: "folder",
                    isFolder: true,
                  })),
                  ...files,
                ]}
                currentPath={currentPath}
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
                sortBy={sortBy}
                onDownload={handleDownload}
                onDownloadFolder={handleDownloadFolder}
                onShare={(item) => {
                  setSelectedItem(item);
                  setShareModalOpen(true);
                }}
                onStar={handleStar}
                onDelete={handleDelete}
              />
            ) : (
              <FileList
                items={[
                  ...folders.map((f) => ({
                    ...f,
                    type: "folder",
                    isFolder: true,
                  })),
                  ...files,
                ]}
                currentPath={currentPath}
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
                sortBy={sortBy}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Nav Toggle Button */}
      <div className="mobile-nav-toggle">
        <Icon name="bars" onClick={() => setMobileNavVisible(true)} />
        <div className="mobile-logo">
          <Icon name="cloud" />
          <span>Cloud Drive</span>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        visible={mobileNavVisible}
        onClose={() => setMobileNavVisible(false)}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onUploadClick={() => setUploadModalOpen(true)}
        storageInfo={storageInfo}
      />

      {/* Sidebar */}
      <div className="dashboard-sidebar desktop-only">
        <div className="logo-section">
          <Icon name="cloud" size="large" />
          <h2>Cloud Drive</h2>
        </div>

        <Button className="new-button" onClick={() => setUploadModalOpen(true)}>
          <Icon name="plus" />
          New
        </Button>

        <Menu vertical fluid className="nav-menu">
          <Menu.Item
            active={currentSection === "my-drive"}
            onClick={() => setCurrentSection("my-drive")}
          >
            <Icon name="home" />
            My Drive
          </Menu.Item>
          <Menu.Item
            active={currentSection === "shared"}
            onClick={() => setCurrentSection("shared")}
          >
            <Icon name="share" />
            Shared with me
          </Menu.Item>
          <Menu.Item
            active={currentSection === "starred"}
            onClick={() => setCurrentSection("starred")}
          >
            <Icon name="star" />
            Starred
          </Menu.Item>
          <Menu.Item
            active={currentSection === "trash"}
            onClick={() => setCurrentSection("trash")}
          >
            <Icon name="trash" />
            Trash
          </Menu.Item>
        </Menu>

        <div className="storage-info">
          <div className="storage-bar">
            <div className="used" style={{ width: "45%" }} />
          </div>
          <p>4.5 GB of 10 GB used</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="main-header">
          <div className="search-bar">
            <Icon name="search" />
            <Input
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <Icon
              name="grid layout"
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            />
            <Icon
              name="list"
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            />
            <Dropdown
              icon={<Icon name="user circle" size="large" />}
              className="user-menu"
            >
              <Dropdown.Menu direction="left">
                <Dropdown.Item text={user?.email} />
                <Dropdown.Divider />
                <Dropdown.Item
                  icon="sign-out"
                  text="Sign out"
                  onClick={logout}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Breadcrumbs & Actions */}
        <div className="content-header">
          <div className="breadcrumbs">
            <Icon
              name="home"
              className="clickable"
              onClick={() => {
                setCurrentPath("/");
                loadFolderContents();
              }}
            />
            {currentPath !== "/" && (
              <>
                <Icon name="angle right" />
                {currentPath
                  .split("/")
                  .filter(Boolean)
                  .map((crumb, index, arr) => (
                    <React.Fragment key={index}>
                      <span className="breadcrumb-item">{crumb}</span>
                      {index < arr.length - 1 && <Icon name="angle right" />}
                    </React.Fragment>
                  ))}
                <Icon
                  name="level up alternate"
                  className="clickable"
                  onClick={handleNavigateUp}
                />
              </>
            )}
          </div>

          <div className="content-actions">
            <Button onClick={() => setNewFolderModalOpen(true)}>
              <Icon name="folder" />
              New Folder
            </Button>
            <Dropdown text="Sort by" className="sort-menu">
              <Dropdown.Menu>
                <Dropdown.Item
                  text="Name"
                  icon={sortBy === "name" ? "check" : null}
                  onClick={() => setSortBy("name")}
                />
                <Dropdown.Item
                  text="Modified"
                  icon={sortBy === "modified" ? "check" : null}
                  onClick={() => setSortBy("modified")}
                />
                <Dropdown.Item
                  text="Size"
                  icon={sortBy === "size" ? "check" : null}
                  onClick={() => setSortBy("size")}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Modals */}
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        currentPath={currentPath}
      />
      <NewFolderModal
        open={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
        onCreate={handleCreateFolder}
        currentPath={currentPath}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
        item={selectedItem}
      />
    </div>
  );
};

export default Dashboard;

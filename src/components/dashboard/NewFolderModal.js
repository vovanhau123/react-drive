import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Icon } from "semantic-ui-react";
import "./NewFolderModal.css";

const NewFolderModal = ({ open, onClose, onCreate, currentPath }) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Auto-suggest folder names based on current path
  useEffect(() => {
    if (folderName.trim()) {
      const suggestedNames = [
        `${folderName} (1)`,
        `${folderName} (2)`,
        `New ${folderName}`,
        `${folderName} Copy`,
      ];
      setSuggestions(suggestedNames);
    } else {
      setSuggestions([]);
    }
  }, [folderName]);

  const handleSubmit = () => {
    if (!folderName.trim()) {
      setError("Please enter a folder name");
      return;
    }

    // Validate folder name
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(folderName)) {
      setError("Folder name contains invalid characters");
      return;
    }

    onCreate(folderName.trim());
    handleClose();
  };

  const handleClose = () => {
    setFolderName("");
    setError("");
    setSuggestions([]);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (name) => {
    setFolderName(name);
    setSuggestions([]);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="tiny"
      className="folder-modal"
      onKeyPress={handleKeyPress}
    >
      <Modal.Header>
        <Icon name="folder outline" />
        Create New Folder
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field className={error ? "error" : ""}>
            <label>Folder Name</label>
            <div className="input-wrapper">
              <Icon name="folder outline" />
              <input
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  setError("");
                }}
                autoFocus
              />
              {folderName && (
                <Icon
                  name="close"
                  className="clear-input"
                  onClick={() => setFolderName("")}
                />
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
          </Form.Field>

          {suggestions.length > 0 && (
            <div className="suggestions">
              <div className="suggestions-title">Suggestions:</div>
              {suggestions.map((name, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(name)}
                >
                  <Icon name="folder outline" />
                  {name}
                </div>
              ))}
            </div>
          )}

          <div className="current-path">
            <Icon name="info circle" />
            New folder will be created in: {currentPath}
          </div>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button primary onClick={handleSubmit} disabled={!folderName.trim()}>
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default NewFolderModal;

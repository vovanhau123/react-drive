import React from "react";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";

const CustomButton = ({
  text,
  onClick,
  position = "center",
  size = "medium",
  variant = "primary",
  className = "",
  style = {},
}) => {
  const getButtonClass = () => {
    const classes = [];

    // Add size class
    if (size === "large") classes.push("large");
    if (size === "huge") classes.push("huge");

    // Add variant class
    if (variant === "primary") classes.push("glow-effect");
    if (variant === "secondary") classes.push("hover-effect");

    // Add custom class
    if (className) classes.push(className);

    return classes.join(" ");
  };

  const getButtonStyle = () => {
    const defaultStyle = {};

    // Add position style
    if (position === "right") {
      defaultStyle.float = "right";
    } else if (position === "left") {
      defaultStyle.float = "left";
    }

    return { ...defaultStyle, ...style };
  };

  return (
    <Button
      primary={variant === "primary"}
      secondary={variant === "secondary"}
      onClick={onClick}
      className={getButtonClass()}
      style={getButtonStyle()}
    >
      {text}
    </Button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  position: PropTypes.oneOf(["left", "center", "right"]),
  size: PropTypes.oneOf(["small", "medium", "large", "huge"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CustomButton;

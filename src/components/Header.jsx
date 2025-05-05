import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Link to your custom CSS file

const Header = () => {
  const navigate = useNavigate();

  return (
    <Menu
      className="custom-header-menu"
      mode="horizontal"
      theme="dark"
      onClick={(e) => navigate(e.key)}
    >
      <Menu.Item key="/home">Home</Menu.Item>
      <Menu.Item key="/students">Students</Menu.Item>
      <Menu.Item key="/performance">Performance</Menu.Item>
      <Menu.Item key="/game-dashboard">Game Dashboard</Menu.Item>
    </Menu>
  );
};

export default Header;

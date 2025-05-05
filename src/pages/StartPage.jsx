import React from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./StartPage.css";

const { Title } = Typography;

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="start-page-container">
      <h1 className="start-page-title">
        Welcome to Dashboard
      </h1>
      <Button
        type="primary"
        size="large"
        className="start-page-button"
        onClick={() => navigate("/home")}
      >
        Enter Dashboard
      </Button>
    </div>
  );
};

export default StartPage;

import React from "react";
import Header from "../components/Header";
import { Typography, Card, Row, Col } from "antd";
import {
  AppstoreOutlined,
  EditOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import "./Home.css";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <>
      <Header />
      <div className="dashboard-home">
        <Paragraph className="dashboard-subtitle">
          Welcome to the Game Performance Management System. Here, you can
          manage games, modify templates, assign questions, track student
          performance, and analyze results to make learning fun and effective!
        </Paragraph>

        <Row gutter={[24, 24]} className="dashboard-cards">
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card" hoverable>
              <AppstoreOutlined className="card-icon" />
              <h3>Games</h3>
              <p>View and manage all educational game modules.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card" hoverable>
              <EditOutlined className="card-icon" />
              <h3>Templates</h3>
              <p>Add or edit question templates and images for games.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card" hoverable>
              <UserOutlined className="card-icon" />
              <h3>Students</h3>
              <p>View student profiles, progress, and participation.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card" hoverable>
              <BarChartOutlined className="card-icon" />
              <h3>Performance</h3>
              <p>Analyze game-based performance reports and insights.</p>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Home;

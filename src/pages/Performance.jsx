import React, { useEffect, useState } from "react";
import { Table, Typography, Card, Select, Row, Col } from "antd";
import Header from "../components/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Performance.css";

const { Option } = Select;

const Performance = () => {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/performance")
      .then((res) => res.json())
      .then((result) => {
        const withKeys = result.map((item, index) => ({
          ...item,
          key: index,
        }));
        setData(withKeys);

        const uniqueStudents = [...new Set(result.map((d) => d.student))];
        setStudents(uniqueStudents);
      });
  }, []);

  const filteredData = data.filter((item) => {
    if (selectedStudent && selectedGame) {
      return item.student === selectedStudent && item.game === selectedGame;
    }
    if (selectedStudent) {
      return item.student === selectedStudent;
    }
    return true;
  });

  const columns = [
    { title: "Student", dataIndex: "student", key: "student" },
    { title: "Game", dataIndex: "game", key: "game" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  // Line chart for selected student
  const studentChartData = filteredData.map((entry, index) => ({
    ...entry,
    order: index + 1, // x-axis based on play sequence
  }));

  // Line chart for overall performance per game (average)
  const overallChartData = Object.values(
    data.reduce((acc, curr) => {
      const key = curr.game;
      if (!acc[key]) {
        acc[key] = {
          game: curr.game,
          totalScore: 0,
          count: 0,
        };
      }
      acc[key].totalScore += curr.score;
      acc[key].count += 1;
      return acc;
    }, {})
  ).map((entry) => ({
    game: entry.game,
    averageScore: entry.totalScore / entry.count,
  }));

  const gamesOfSelectedStudent = [
    ...new Set(data.filter((d) => d.student === selectedStudent).map((d) => d.game)),
  ];

  return (
    <>
      <Header />
      <div className="performance-page">
        <Typography.Title level={3} className="performance-title">
          Game Performance Overview
        </Typography.Title>

        <Row gutter={16} className="filters">
          <Col span={8}>
            <Select
              placeholder="Select Student"
              value={selectedStudent}
              onChange={(value) => {
                setSelectedStudent(value);
                setSelectedGame(null); // Reset game when student changes
              }}
              style={{ width: "100%" }}
              allowClear
            >
              {students.map((student) => (
                <Option key={student} value={student}>
                  {student}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Select Game"
              value={selectedGame}
              onChange={(value) => setSelectedGame(value)}
              style={{ width: "100%" }}
              allowClear
              disabled={!selectedStudent}
            >
              {gamesOfSelectedStudent.map((game) => (
                <Option key={game} value={game}>
                  {game}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Card className="performance-table-card">
          <Table
            columns={columns}
            dataSource={filteredData}
            bordered
            pagination={{ pageSize: 5 }}
            className="performance-table"
          />
        </Card>

        <Typography.Title level={4} className="chart-title">
          📊 Overall Game Performance (All Students)
        </Typography.Title>
        <Card className="performance-chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overallChartData}>
              <XAxis dataKey="game" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#1890ff"
                strokeWidth={2}
                name="Avg Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {selectedStudent && (
          <>
            <Typography.Title level={4} className="chart-title">
              📈 {selectedStudent}'s Performance Over Time
            </Typography.Title>
            <Card className="performance-chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentChartData}>
                  <XAxis dataKey="order" tickFormatter={(val) => `Play #${val}`} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#52c41a"
                    strokeWidth={2}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default Performance;

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  List,
  message,
  Space,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

const BirdForm = () => {
  const [emoji, setEmoji] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionsList, setQuestionsList] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/bird/questions");
      const data = await response.json();
      const questionList = Object.entries(data).map(
        ([emoji, questionData]) => ({
          emoji,
          question: questionData.question,
          answer: questionData.answer,
        })
      );

      setQuestionsList(questionList);
    } catch (error) {
      console.error("Error fetching questions:", error);
      message.error("An error occurred while fetching the questions.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    if (!emoji || !question || !answer) {
      message.error("Please enter all fields: emoji, question, and answer.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/api/bird/questions/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, question, answer }),
      }
    );

    const result = await response.json();
    message.success(result.message);
    setEmoji("");
    setQuestion("");
    setAnswer("");
    fetchQuestions();
  };

  const handleDelete = async (emoji) => {
    const response = await fetch(
      "http://127.0.0.1:5000/api/bird/questions/delete",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      message.success(result.message);
      fetchQuestions();
    } else {
      const result = await response.json();
      message.error(result.message);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px #ddd",
      }}
    >
      <Title level={4}>🐦 Add a Bird Question</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Emoji">
          <Input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="Enter the emoji"
          />
        </Form.Item>

        <Form.Item label="Question">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question"
          />
        </Form.Item>

        <Form.Item label="Answer">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Add Question
        </Button>
      </Form>

      <Title level={4} style={{ marginTop: 32 }}>
        📋 Questions List
      </Title>
      <List
        bordered
        dataSource={questionsList}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                danger
                onClick={() => handleDelete(item.emoji)}
                key="delete"
              >
                Delete
              </Button>,
            ]}
          >
            <div>
              <strong>{item.emoji}</strong> <br />
              Question: {item.question} <br />
              Answer: <strong>{item.answer}</strong>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BirdForm;

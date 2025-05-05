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

const NinjaForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionsList, setQuestionsList] = useState([]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const updateCorrectAnswerOptions = () => {
    return options.filter((opt) => opt.trim());
  };

  const fetchQuestions = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/ninja/questions");
    const data = await response.json();
    setQuestionsList(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    if (
      !question ||
      options.filter((opt) => opt.trim()).length < 2 ||
      !correctAnswer
    ) {
      message.error(
        "Please enter a valid question, at least 2 options, and select a correct answer."
      );
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/api/ninja/questions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        options: options.filter(Boolean),
        correctAnswer,
      }),
    });

    const result = await response.json();
    message.success(result.message);
    setQuestion("");
    setOptions(["", ""]);
    setCorrectAnswer("");
    fetchQuestions();
  };

  const handleDelete = async (index) => {
    const response = await fetch("http://127.0.0.1:5000/api/ninja/questions/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });

    const result = await response.json();
    message.success(result.message);
    fetchQuestions();
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
      <Title level={4}>🧠 Add a Math Question</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Question">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your math question"
          />
        </Form.Item>

        <Form.Item label="Options">
          <Space direction="vertical" style={{ width: "100%" }}>
            {options.map((opt, idx) => (
              <Input
                key={idx}
                value={opt}
                placeholder={`Option ${idx + 1}`}
                onChange={(e) => updateOption(e.target.value, idx)}
              />
            ))}
            <Button onClick={addOption}>Add Option</Button>
          </Space>
        </Form.Item>

        <Form.Item label="Correct Answer">
          <Select
            placeholder="Select the correct answer"
            value={correctAnswer}
            onChange={setCorrectAnswer}
          >
            {updateCorrectAnswerOptions().map((opt, idx) => (
              <Option key={idx} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
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
              <Button danger onClick={() => handleDelete(index)}>
                Delete
              </Button>,
            ]}
          >
            <div>
              <strong>{item.question}</strong> <br />
              Options: {item.options.join(", ")} <br />
              Answer: <strong>{item.correctAnswer}</strong>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NinjaForm;

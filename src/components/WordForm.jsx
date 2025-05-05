import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Image,
  List,
  Space,
  Divider,
  Modal,
  Select,
} from "antd";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import RenderImageGrid from "./ImageGrid";
import "./WordForm.css";

const { Option } = Select;

const WordForm = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [words, setWords] = useState([]);
  const [form] = Form.useForm();

  const [bgModalVisible, setBgModalVisible] = useState(false);
  const [charModalVisible, setCharModalVisible] = useState(false);

  const [selectedBg, setSelectedBg] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    fetchWordAssets();
    fetchWords();
    fetchSelectedImages(); // 👈 fetch already selected background/character
  }, []);

  const fetchWordAssets = async () => {
    const bgRes = await fetch("http://localhost:5000/api/word/backgrounds");
    const bgData = await bgRes.json();
    setBackgrounds(bgData.images || []);

    const charRes = await fetch("http://localhost:5000/api/word/characters");
    const charData = await charRes.json();
    setCharacters(charData.images || []);
  };

  const fetchWords = async () => {
    const res = await fetch("http://localhost:5000/api/word/words");
    const data = await res.json();
    setWords(data.words || []);
  };

  const fetchSelectedImages = async () => {
    try {
      const bgRes = await fetch(
        "http://127.0.0.1:5000/api/word/selected/background"
      );
      const bgData = await bgRes.json();
      if (bgData.selected_image) {
        setSelectedBg(bgData.selected_image);
      }

      const charRes = await fetch(
        "http://127.0.0.1:5000/api/word/selected/character"
      );
      const charData = await charRes.json();
      if (charData.selected_character) {
        setSelectedChar(charData.selected_character);
      }
    } catch (error) {
      console.error("Error fetching selected images:", error);
    }
  };

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      background: selectedBg,
      character: selectedChar,
    };

    const res = await fetch("http://localhost:5000/api/word/words/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      message.success("Word added successfully.");
      form.resetFields();
      setSelectedBg(null);
      setSelectedChar(null);
      fetchWords();
    } else {
      message.error("Failed to add word.");
    }
  };

  const deleteWord = async (index) => {
    const res = await fetch("http://localhost:5000/api/word/words/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });

    const result = await res.json();
    message.success(result.message);
    fetchWords();
  };

  const submitSelectedBackground = async (image) => {
    setSelectedBg(image);
    try {
      const res = await fetch(
        "http://localhost:5000/api/word/submit/background",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        }
      );

      if (res.ok) {
        message.success("Background submitted successfully.");
      } else {
        message.error("Failed to submit background.");
      }
    } catch (error) {
      console.error("Error submitting background:", error);
      message.error("Something went wrong.");
    }
  };

  const submitSelectedCharacter = async (image) => {
    setSelectedChar(image);
    try {
      const res = await fetch(
        "http://localhost:5000/api/word/submit/character",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        }
      );

      if (res.ok) {
        message.success("Character submitted successfully.");
      } else {
        message.error("Failed to submit character.");
      }
    } catch (error) {
      console.error("Error submitting character:", error);
      message.error("Something went wrong.");
    }
  };

  return (
    <div className="word-form-container">
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* Background and Character Selection */}
        <Form.Item label="Select Background">
          <Button
            icon={<PictureOutlined />}
            onClick={() => setBgModalVisible(true)}
          >
            Choose Background
          </Button>
          {selectedBg && (
            <div style={{ marginTop: 10 }}>
              <Image
                width={100}
                src={`http://127.0.0.1:5000/api/word/uploads/background/${selectedBg}`}
                preview={false}
              />
              <div style={{ textAlign: "center" }}>{selectedBg}</div>
            </div>
          )}
        </Form.Item>

        <Form.Item label="Select Character">
          <Button
            icon={<PictureOutlined />}
            onClick={() => setCharModalVisible(true)}
          >
            Choose Character
          </Button>
          {selectedChar && (
            <div style={{ marginTop: 10 }}>
              <Image
                width={100}
                src={`http://127.0.0.1:5000/api/word/uploads/character/${selectedChar}`}
                preview={false}
              />
              <div style={{ textAlign: "center" }}>{selectedChar}</div>
            </div>
          )}
        </Form.Item>

        {/* Word and Emoji Input */}
        <Form.Item name="word" label="Word" rules={[{ required: true }]}>
          <Input placeholder="Enter a word" />
        </Form.Item>

        <Form.Item name="emoji" label="Emoji" rules={[{ required: true }]}>
          <Input placeholder="Enter an emoji" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Word
          </Button>
        </Form.Item>
      </Form>

      {/* Modal for Background Selection */}
      <Modal
        title="Select Background"
        open={bgModalVisible}
        footer={null}
        onCancel={() => setBgModalVisible(false)}
        width={800}
      >
        <RenderImageGrid
          images={backgrounds}
          baseUrl="background"
          onSelect={(img) => setSelectedBg(img)}
          onSubmit={submitSelectedBackground}
        />
      </Modal>

      {/* Modal for Character Selection */}
      <Modal
        title="Select Character"
        open={charModalVisible}
        footer={null}
        onCancel={() => setCharModalVisible(false)}
        width={800}
      >
        <RenderImageGrid
          images={characters}
          baseUrl="character"
          onSelect={(img) => setSelectedChar(img)}
          onSubmit={submitSelectedCharacter}
        />
      </Modal>

      {/* List of Words */}
      <Divider />
      <List
        size="small"
        bordered
        dataSource={words}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => deleteWord(index)}
              >
                Delete
              </Button>,
            ]}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>{item.word}</div>
              <div>{item.emoji}</div>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};

export default WordForm;

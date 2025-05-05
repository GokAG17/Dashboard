import React, { useState } from "react";
import {
  Table,
  Upload,
  Button,
  Form,
  Input,
  Typography,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import TemplateAForm from "../components/WordForm";
import TemplateBForm from "../components/NinjaForm";
import TemplateCForm from "../components/BirdForm";
import "./GameDashboard.css";

const { Option } = Select;

const staticTemplates = [
  { name: "Word Template" },
  { name: "Ninja Template" },
  { name: "Bird Template" },
];

// Map template names to form components
const templateForms = {
  "Word Template": TemplateAForm,
  "Ninja Template": TemplateBForm,
  "Bird Template": TemplateCForm,
};

const GameDashboard = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const SelectedFormComponent =
    selectedTemplate && templateForms[selectedTemplate];

  return (
    <>
      <Header />
      <div className="game-dashboard-page">
        <Typography.Title level={3}>Game Template Editor</Typography.Title>

        <Form layout="vertical" className="game-dashboard-form">
          <Form.Item
            name="template"
            label="Select Template"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Choose a template"
              onChange={(value) => setSelectedTemplate(value)}
            >
              {staticTemplates.map((t) => (
                <Option key={t.name} value={t.name}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        {SelectedFormComponent && (
          <div style={{ marginTop: 24 }}>
            <Typography.Title level={4}>
              {selectedTemplate} Configuration
            </Typography.Title>
            <SelectedFormComponent />
          </div>
        )}
      </div>
    </>
  );
};

export default GameDashboard;

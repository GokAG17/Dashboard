import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import Header from "../components/Header";
import "./Students.css";
import moment from "moment";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/students");
      const data = await res.json();
      console.log(data);
      setStudents(data);
    } catch (err) {
      console.error("❌ Failed to fetch students:", err);
      message.error("Failed to fetch student list.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showModal = (student = null) => {
    setEditingStudent(student);
    if (student) {
      form.setFieldsValue({
        name: student.name,
        rollno: student.rollno,
        class: student.class,
        dob: moment(student.dob),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
      message.success("Student deleted!");
      fetchStudents();
    } catch (err) {
      console.error("❌ Failed to delete student:", err);
      message.error("Failed to delete student.");
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      rollno: values.rollno,
      class: values.class,
      dob: values.dob.format("YYYY-MM-DD"),
    };

    try {
      if (editingStudent) {
        const res = await fetch(
          `http://localhost:5000/api/students/${editingStudent._id.$oid}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const result = await res.json();
        if (res.ok) {
          message.success("Student updated!");
        } else {
          message.error(result.message || "Failed to update student.");
        }
      } else {
        const res = await fetch("http://localhost:5000/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok) {
          message.success("Student added!");
        } else {
          message.error(result.message || "Failed to add student.");
        }
      }

      setIsModalVisible(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      message.error("Something went wrong!");
    }
  };

  const columns = [
    { title: "Roll No", dataIndex: "rollno", key: "rollno" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Class", dataIndex: "class", key: "class" },
    { title: "Date of Birth", dataIndex: "dob", key: "dob" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this student?"
            onConfirm={() => handleDelete(record._id.$oid)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="students-page">
        <Typography.Title level={3} className="students-title">
          Student Directory
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ marginBottom: 16 }}
        >
          Add Student
        </Button>
        <Table
          columns={columns}
          dataSource={students}
          rowKey={(record) => record._id.$oid}
          bordered
          pagination={{ pageSize: 6 }}
          className="students-table"
        />

        <Modal
          title={editingStudent ? "Edit Student" : "Add Student"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Roll No"
              name="rollno"
              rules={[{ required: true, message: "Please input roll number!" }]}
            >
              <Input disabled={!!editingStudent} />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input student name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Class"
              name="class"
              rules={[{ required: true, message: "Please input class!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Please select DOB!" }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Students;

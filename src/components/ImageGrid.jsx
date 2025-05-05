import React, { useState } from "react";
import { Button } from "antd";
import "./ImageGrid.css";

const RenderImageGrid = ({ images, baseUrl, onSelect, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelect = (img) => {
    onSelect(img);
  };

  return (
    <div className="image-carousel">
      {/* Image Display */}
      <div className="image-display">
        <div
          className="image-box"
          onClick={() => handleSelect(images[currentIndex])}
          style={{
            cursor: "pointer",
            border: "2px solid transparent",
            margin: "10px",
            position: "relative",
          }}
        >
          <img
            src={`http://localhost:5000/api/word/uploads/${baseUrl}/${images[currentIndex]}`}
            alt={images[currentIndex]}
            style={{
              width: "550px",
              height: "550px",
              objectFit: "cover",
              borderRadius: "10px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="carousel-nav">
        <Button
          type="primary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ marginRight: "10px" }}
        >
          Left
        </Button>
        <Button
          type="primary"
          onClick={handleNext}
          disabled={currentIndex === images.length - 1}
        >
          Right
        </Button>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => onSubmit(images[currentIndex])} // Submit selected image
        >
          Submit Image
        </Button>
      </div>
    </div>
  );
};

export default RenderImageGrid;

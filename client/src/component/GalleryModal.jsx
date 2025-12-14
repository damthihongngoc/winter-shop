import { useState } from "react";
import "./style/GalleryModal.scss";
export default function GalleryModal({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);

  return (
    <div className="gallery-modal" onClick={onClose}>
      <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
        <img src={images[current]} alt="" />

        <button
          className="prev"
          onClick={() =>
            setCurrent((current - 1 + images.length) % images.length)
          }
        >
          ‹
        </button>

        <button
          className="next"
          onClick={() => setCurrent((current + 1) % images.length)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

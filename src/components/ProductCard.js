import React from "react";
import "./ProductCard.css";

function ProductCard({ part }) {
  return (
    <a
      className="product-card"
      href={part.source_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {part.image_url && (
        <img className="product-card-img" src={part.image_url} alt={part.name} />
      )}
      <div className="product-card-body">
        <div className="product-card-name">{part.name}</div>
        <div className="product-card-meta">
          <span className="product-card-pn">{part.part_number}</span>
          {part.price && (
            <span className="product-card-price">{part.price}</span>
          )}
        </div>
      </div>
    </a>
  );
}

export default ProductCard;

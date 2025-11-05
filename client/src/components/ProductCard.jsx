import React from 'react';

// 'product' and 'onDelete' are passed in as props from App.jsx
function ProductCard({ product, onDelete }) {
  // Get the latest price from the history
  const latestPrice = product.priceHistory[product.priceHistory.length - 1];

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.title} className="product-image" />
      <div className="product-info">
        <h4>{product.title}</h4>
        <p className="product-price">
          ${latestPrice ? latestPrice.price : 'N/A'}
        </p>
        <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
          View Product
        </a>
      </div>
      <button onClick={() => onDelete(product._id)} className="delete-btn">
        &times;
      </button>
    </div>
  );
}

export default ProductCard;
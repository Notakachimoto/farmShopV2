import React, { useState } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const MAX_RANGE = 500;

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1);
    setMinPrice(value);
    if (onPriceChange) onPriceChange(value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1);
    setMaxPrice(value);
    if (onPriceChange) onPriceChange(minPrice, value);
  };

  const minPercent = (minPrice / MAX_RANGE) * 100;
  const maxPercent = (maxPrice / MAX_RANGE) * 100;

  const progressStyle = {
    background: `linear-gradient(to right, #e0e0e0 ${minPercent}%, #4CAF50 ${minPercent}%, #4CAF50 ${maxPercent}%, #e0e0e0 ${maxPercent}%)`
  };

  return (
    <div className="price-filter">
      <div className="price-range">
        <span>{minPrice} ₽</span>
        <span> – </span>
        <span>{maxPrice} ₽</span>
      </div>
      <div className="slider-container" style={progressStyle}>
        <input
          type="range"
          min="0"
          max={MAX_RANGE}
          value={minPrice}
          onChange={handleMinPriceChange}
          className="slider"
        />
        <input
          type="range"
          min="0"
          max={MAX_RANGE}
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="slider"
        />
      </div>
      <div className="price-inputs">
        <input
          type="number"
          min="0"
          max={maxPrice - 1}
          value={minPrice}
          onChange={handleMinPriceChange}
          className="price-input"
        />
        <span> – </span>
        <input
          type="number"
          min={minPrice + 1}
          max={MAX_RANGE}
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="price-input"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
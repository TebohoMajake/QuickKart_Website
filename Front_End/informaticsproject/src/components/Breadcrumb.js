// Breadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom'; 
// Import your CSS for styling

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.url ? (
              <Link to={item.url}>{item.name}</Link>
            ) : (
              <span className="active" aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

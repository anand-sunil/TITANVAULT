import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryPanel = ({ category, c1, c2, c3, subtitle }) => {
  return (
    <Link
      to={`/${category}`}
      className={`panel cat ${category}`}
      style={{ '--c1': c1, '--c2': c2, '--c3': c3 }}
      onClick={() => window.scrollTo(0, 0)}
    >
      <h2 className="bg">{category.toUpperCase()}</h2>
      <p className="bg">{subtitle}</p>
      <button type="button" className="arrow" aria-label={`Go to ${category}`}>
        ›
      </button>
    </Link>
  );
};

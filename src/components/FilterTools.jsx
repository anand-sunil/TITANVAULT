import React from 'react';

export const FilterTools = ({
  genres,
  activeFilter,
  onFilterChange,
  sortOptions,
  currentSort,
  onSortChange
}) => {
  return (
    <div className="tools">
      {genres.map((g) => (
        <button
          key={g}
          type="button"
          className={`chip ${activeFilter === g ? 'on' : ''}`}
          onClick={() => onFilterChange(g)}
        >
          {g}
        </button>
      ))}
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};

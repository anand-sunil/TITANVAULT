import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageBanner } from './PageBanner';
import { FilterTools } from './FilterTools';
import { MediaCard } from './MediaCard';

export const MediaGridPage = ({
  pageKey,
  config,
  items
}) => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState(config.defaultSort);

  const sortOptions = useMemo(() => {
    return [config.defaultSort, 'Rating', 'Year', 'Title'].filter(
      (v, i, a) => a.indexOf(v) === i
    );
  }, [config.defaultSort]);

  const filteredAndSortedList = useMemo(() => {
    let list = [...items];

    // Filter
    if (filter !== 'All') {
      const typeMap = { Movies: 'movies', Anime: 'anime', Series: 'series' };
      if (typeMap[filter]) {
        list = list.filter((i) => i.type === typeMap[filter]);
      } else {
        list = list.filter((i) => i.g === filter);
      }
    }

    // Sort
    if (sort === 'Rating') {
      list.sort((a, b) => b.r - a.r);
    } else if (sort === 'Year') {
      list.sort((a, b) => b.y - a.y);
    } else if (sort === 'Title') {
      list.sort((a, b) => a.t.localeCompare(b.t));
    }

    return list;
  }, [items, filter, sort]);

  return (
    <>
      <PageBanner
        type={pageKey}
        title={config.t}
        tag={config.tag}
        h={config.h}
        isWatchlist={config.isWatchlist}
      />

      <FilterTools
        genres={config.genres}
        activeFilter={filter}
        onFilterChange={setFilter}
        sortOptions={sortOptions}
        currentSort={sort}
        onSortChange={setSort}
      />

      <div className="grid">
        {filteredAndSortedList.length > 0 ? (
          filteredAndSortedList.map((item) => (
            <MediaCard key={item.t} item={item} />
          ))
        ) : (
          <div
            className="comic-empty-grid-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              background: '#090910',
              border: '3px dashed var(--cream)',
              boxShadow: '4px 4px 0 #000',
              margin: '12px 0 30px',
            }}
          >
            <h3 className="bg" style={{ color: 'var(--yel)', fontSize: '32px', marginBottom: '8px', letterSpacing: '0.03em' }}>
              VAULT ARCHIVES EMPTY
            </h3>
            <p style={{ color: '#bbb', fontSize: '16px', marginBottom: '20px', fontFamily: 'Oswald, sans-serif' }}>
              No {config.t.toLowerCase()} found in your vault yet. Start building your collection!
            </p>
            <Link
              to="/add"
              className="btn bg"
              style={{
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '22px',
                padding: '8px 26px',
              }}
            >
              + ADD TO VAULT →
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageBanner } from './PageBanner';
import { FilterTools } from './FilterTools';
import { MediaCard } from './MediaCard';
import { MediaDetailModal } from './MediaDetailModal';

export const MediaGridPage = ({
  pageKey,
  config,
  items
}) => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState(config.defaultSort);
  const [selectedItem, setSelectedItem] = useState(null);

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
        const targetGenre = filter.toLowerCase().trim();
        list = list.filter((i) => {
          if (Array.isArray(i.genres) && i.genres.length > 0) {
            return i.genres.some((g) => {
              const gLower = g.toLowerCase().trim();
              return (
                gLower === targetGenre ||
                gLower.includes(targetGenre) ||
                targetGenre.includes(gLower)
              );
            });
          }
          if (i.g) {
            const gLower = i.g.toLowerCase().trim();
            return (
              gLower === targetGenre ||
              gLower.includes(targetGenre) ||
              targetGenre.includes(gLower)
            );
          }
          return false;
        });
      }
    }

    // Sort
    if (sort === 'Rating') {
      list.sort((a, b) => {
        const rA = a.r != null ? Number(a.r) : -1;
        const rB = b.r != null ? Number(b.r) : -1;
        return rB - rA;
      });
    } else if (sort === 'Year') {
      list.sort((a, b) => {
        const yA = a.y != null ? Number(a.y) : 0;
        const yB = b.y != null ? Number(b.y) : 0;
        return yB - yA;
      });
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
            <MediaCard key={item.t} item={item} onSelect={setSelectedItem} />
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

      {selectedItem && (
        <MediaDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

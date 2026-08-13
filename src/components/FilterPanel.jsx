import { useEffect, useRef, useState } from 'react';
import './filter-panel.css';

const SORT_OPTIONS = [
  ['date-desc', 'Newest first'],
  ['date-asc', 'Oldest first'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['name-asc', 'Name A\u2013Z'],
  ['name-desc', 'Name Z\u2013A'],
];

export default function FilterPanel({
  filters = {},
  onChange,
  onReset,
  resultCount,
  loading = false,
  hideBrand = false,
  hideOnSale = false,
}) {
  const [search, setSearch] = useState(filters.search || '');
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    setSearch(filters.search || '');
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const push = (patch) => onChange({ ...filters, ...patch });

  const debounced = (patch) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(patch), 350);
  };

  const chips = [];
  if (filters.search) chips.push({ key: 'search', label: `\u201C${filters.search}\u201D`, clear: () => push({ search: '' }) });
  if (filters.minPrice) chips.push({ key: 'min', label: `From \u00A3${filters.minPrice}`, clear: () => push({ minPrice: '' }) });
  if (filters.maxPrice) chips.push({ key: 'max', label: `Up to \u00A3${filters.maxPrice}`, clear: () => push({ maxPrice: '' }) });
  if (filters.brand) chips.push({ key: 'brand', label: filters.brand, clear: () => push({ brand: '' }) });
  if (filters.onSale) chips.push({ key: 'sale', label: 'On sale', clear: () => push({ onSale: false }) });

  const isDefault =
    !filters.search &&
    !filters.minPrice &&
    !filters.maxPrice &&
    !filters.brand &&
    !filters.onSale &&
    (filters.sort || 'date-desc') === 'date-desc';

  return (
    <div className="filter-panel">
      <div className="filter-panel__body">
        <div className="filter-panel__row">
          <label className="filter-panel__field filter-panel__field--search">
            <span className="filter-panel__label">Search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debounced({ search: e.target.value });
              }}
              placeholder="Search Product"
            />
          </label>

          <label className="filter-panel__field">
            <span className="filter-panel__label">Sort</span>
            <select
              value={filters.sort || 'date-desc'}
              onChange={(e) => push({ sort: e.target.value })}
            >
              {SORT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          {!hideBrand && (
            <label className="filter-panel__field">
              <span className="filter-panel__label">Brand</span>
              <select
                value={filters.brand || ''}
                onChange={(e) => push({ brand: e.target.value })}
              >
                <option value="">All brands</option>
                <option value="Arias">Arias</option>
                <option value="Llorens">Llorens</option>
              </select>
            </label>
          )}

          <div className="filter-panel__field">
            <span className="filter-panel__label">Price (£)</span>
            <div className="filter-panel__price">
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  debounced({ minPrice: e.target.value });
                }}
                placeholder="Min"
                aria-label="Minimum price"
              />
              <span className="filter-panel__price-sep" aria-hidden="true">–</span>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  debounced({ maxPrice: e.target.value });
                }}
                placeholder="Max"
                aria-label="Maximum price"
              />
            </div>
          </div>

          {!hideOnSale && (
            <label className="filter-panel__toggle">
              <input
                type="checkbox"
                checked={!!filters.onSale}
                onChange={(e) => push({ onSale: e.target.checked })}
              />
              <span>On sale</span>
            </label>
          )}

          <button
            type="button"
            className="filter-panel__clear"
            onClick={onReset}
            disabled={isDefault}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="filter-panel__meta">
        <span className="filter-panel__count">
          {loading
            ? 'Updating…'
            : `${resultCount} piece${resultCount === 1 ? '' : 's'}`}
        </span>
        {chips.length > 0 && (
          <div className="filter-panel__chips">
            {chips.map((chip) => (
              <button key={chip.key} type="button" className="filter-panel__chip" onClick={chip.clear}>
                {chip.label} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

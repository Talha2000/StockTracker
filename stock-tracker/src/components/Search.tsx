import { Search as SearchIcon, X } from 'lucide-react';
import { useId, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSymbolSearch } from '@/hooks/useMarket';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 300;
const MAX_RESULTS = 8;

/** Typeahead: suggestions appear as you type (debounced), pick with mouse or arrow keys + Enter. */
export const Search = () => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const listId = useId();

  const query = useDebouncedValue(input.trim(), DEBOUNCE_MS);
  const { data, isFetching, isError } = useSymbolSearch(query);

  const results = query ? (data?.result.slice(0, MAX_RESULTS) ?? []) : [];
  const settled = query === input.trim() && !isFetching;
  const showList = open && input.trim().length > 0;

  const clear = () => {
    setInput('');
    setActive(-1);
  };

  const select = (symbol: string) => {
    clear();
    setOpen(false);
    void navigate(`/${symbol}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const pick = results[active] ?? results[0];
      if (pick) select(pick.symbol);
    } else if (event.key === 'Escape') {
      if (showList) setOpen(false);
      else clear();
    }
  };

  return (
    <div role="search" className="relative">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        role="combobox"
        aria-label="Search stocks"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        value={input}
        placeholder="Search a company or symbol"
        className="h-10 w-full rounded-full bg-surface pr-10 pl-10 text-sm text-ink ring-1 ring-line ring-inset placeholder:text-muted hover:ring-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onChange={(event) => {
          setInput(event.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
        }}
        onKeyDown={onKeyDown}
      />
      {input && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-ink/6 hover:text-ink"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}

      {showList && (
        <div className="absolute inset-x-0 top-12 z-40 overflow-hidden rounded-panel bg-page shadow-[0_12px_40px_-12px_rgb(0_0_0/0.3)] ring-1 ring-line">
          {isError && (
            <p role="alert" className="px-4 py-3 text-sm text-down">
              Search isn’t available right now. Try again in a moment.
            </p>
          )}
          {!isError && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">
              {settled ? `No stocks match “${input.trim()}”.` : 'Searching…'}
            </p>
          )}
          {/* Options take mouse clicks; keyboard selection goes through the input (combobox pattern). */}
          <ul
            id={listId}
            role="listbox"
            aria-label="Matching stocks"
            className={cn('max-h-80 overflow-y-auto p-1.5', results.length === 0 && 'hidden')}
          >
            {results.map((item, index) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keys handled on the combobox input
              <li
                key={item.symbol}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                // mousedown would blur the input (closing the list) before the click lands.
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  select(item.symbol);
                }}
                onMouseEnter={() => {
                  setActive(index);
                }}
                className="flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2 aria-selected:bg-ink/6"
              >
                <span className="w-20 shrink-0 text-sm font-bold">{item.displaySymbol}</span>
                <span className="truncate text-sm text-muted">{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

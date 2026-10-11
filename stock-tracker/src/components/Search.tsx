import { Search as SearchIcon, X } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router';
import { useSymbolSearch } from '@/hooks/useMarket';

export const Search = () => {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');
  const navigate = useNavigate();
  const { data, isFetching, isError } = useSymbolSearch(submitted);

  const results = submitted && input ? (data?.result ?? []) : [];
  const noMatches = submitted && input && !isFetching && !isError && data?.result.length === 0;

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    setSubmitted(input.trim());
  };

  const clear = () => {
    setInput('');
    setSubmitted('');
  };

  const select = (symbol: string) => {
    clear();
    void navigate(`/${symbol}`);
  };

  return (
    <div className="relative">
      <form role="search" onSubmit={handleSubmit} className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={input}
          aria-label="Search stocks"
          placeholder="Search a company or symbol"
          className="h-10 w-full rounded-full bg-surface pr-10 pl-10 text-sm text-ink ring-1 ring-line ring-inset placeholder:text-muted hover:ring-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onChange={(event) => {
            setInput(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') clear();
          }}
        />
        {input && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </form>

      {(isFetching || isError || noMatches || results.length > 0) && (
        <div className="absolute inset-x-0 top-12 z-40 overflow-hidden rounded-panel bg-surface shadow-[0_12px_40px_-12px_rgb(21_24_48/0.35)] ring-1 ring-line">
          {isFetching && <p className="px-4 py-3 text-sm text-muted">Searching…</p>}
          {isError && (
            <p role="alert" className="px-4 py-3 text-sm text-down">
              Search failed. Try again.
            </p>
          )}
          {noMatches && (
            <p className="px-4 py-3 text-sm text-muted">No stocks match “{submitted}”.</p>
          )}
          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.map((item) => (
                <li key={item.symbol}>
                  <button
                    type="button"
                    onClick={() => {
                      select(item.symbol);
                    }}
                    className="flex w-full cursor-pointer items-baseline gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-ink/5 dark:hover:bg-white/8"
                  >
                    <span className="w-20 shrink-0 font-bold">{item.displaySymbol}</span>
                    <span className="truncate text-sm text-muted">{item.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

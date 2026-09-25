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
    <div className="relative z-50 w-full max-w-96">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center rounded-md border-2 border-black bg-white dark:border-neutral-200"
      >
        <input
          type="text"
          value={input}
          aria-label="Search stocks"
          className="w-full rounded-md px-4 py-2 text-black focus:outline-none"
          placeholder="Search stock…"
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        {input && (
          <button type="button" onClick={clear} aria-label="Clear search" className="m-1">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="m-1 flex h-8 w-8 items-center justify-center rounded-md bg-cyan-800 text-gray-100 hover:ring-2 hover:ring-cyan-700"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      {isFetching && <p className="mt-1 text-sm">Searching…</p>}
      {isError && (
        <p role="alert" className="mt-1 text-sm text-red-500">
          Search failed. Try again.
        </p>
      )}

      {results.length > 0 && (
        <ul className="custom-scrollbar absolute top-12 h-64 w-full overflow-y-scroll rounded-md border-2 border-gray-700 bg-white text-black dark:border-gray-800 dark:bg-gray-900 dark:text-white">
          {results.map((item) => (
            <li key={item.symbol}>
              <button
                type="button"
                onClick={() => {
                  select(item.symbol);
                }}
                className="m-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-md p-4 text-left transition duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <span>{item.symbol}</span>
                <span>{item.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

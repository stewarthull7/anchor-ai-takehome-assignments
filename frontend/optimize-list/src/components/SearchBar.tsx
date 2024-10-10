

type SearchBarProps = {
    query: string;
    setQuery: (query: string) => void;
    };

function SearchBar({ query, setQuery }: SearchBarProps) {

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      style={{
        width: '100%',
      }}
    />
  );
}

export default SearchBar;

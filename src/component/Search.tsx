import { Search as SearchIcon } from "lucide-react";

type Props = {
  onChange: (value: string) => void;
  value: string;
  placeHolder?: string;
  className? : string
};

const Search = ({ value, onChange, placeHolder, className }: Props) => {
  return (
    <div className="relative w-full">
      {/* icon */}
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      {/* input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeHolder}
        className={`w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black/20 ${className}`}
      />
    </div>
  );
};

export default Search;

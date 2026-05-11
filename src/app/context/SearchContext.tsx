import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  districtFilter: string;
  setDistrictFilter: (district: string) => void;
  ratingFilter: number | null;
  setRatingFilter: (rating: number | null) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("rating");

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        districtFilter,
        setDistrictFilter,
        ratingFilter,
        setRatingFilter,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
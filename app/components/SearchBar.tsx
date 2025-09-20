/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import debounce from "lodash/debounce";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface Course {
  id?: string;
  title: string;
  short_description?: string;
  thumbnailUrl: string;
  courseFor: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim() === "") {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_SERVER_URL
          }/api/search?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const showDropdown = query.trim() !== "" && (isFocused || isDropdownHovered);

  return (
    <div className="w-full max-w-5xl relative z-20">
      <div
        className={`relative bg-gray-800 w-full h-14 border border-myred rounded-full px-6 flex items-center shadow-md transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-myred/50 shadow-myred/50"
            : "hover:shadow-myred/30"
        }`}
      >
        <input
          className="w-full focus:outline-none text-sm sm:text-base bg-transparent placeholder-gray-400 text-gray-100 z-20"
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
          }}
        />
        <FaMagnifyingGlass
          className={`text-gray-400 transition duration-150 cursor-pointer ${
            isSearching
              ? "animate-pulse text-myred-secondary"
              : "hover:text-myred-secondary"
          }`}
        />
      </div>

      {showDropdown && (
        <div
          className="absolute top-20 w-full bg-gray-800 rounded-xl shadow-xl border border-myred max-h-96 overflow-y-auto z-20 transition-all duration-200 ease-in-out opacity-100 scale-100"
          onMouseEnter={() => setIsDropdownHovered(true)}
          onMouseLeave={() => setIsDropdownHovered(false)}
        >
          {isSearching ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-myred-secondary"></div>
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-myred/50">
              {results.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <li className="p-4 hover:bg-myred-dark hover:text-white active:bg-myred transition-colors duration-200 cursor-pointer flex items-center gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-100">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {course.short_description}
                      </p>
                      <span className="text-xs text-myred-secondary capitalize">
                        {course.courseFor}
                      </span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No courses found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

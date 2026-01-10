import { useState, useEffect, useRef } from 'react';
import { searchCities } from '../services/weatherApi';
import type { GeoLocation } from '../services/weatherApi';

interface SearchBarProps {
    onLocationSelect: (location: GeoLocation) => void;
    onGetCurrentLocation: () => void;
    isLoading?: boolean;
}

export function SearchBar({ onLocationSelect, onGetCurrentLocation, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsSearching(true);
        searchTimeout.current = window.setTimeout(async () => {
            const results = await searchCities(query);
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
            setIsSearching(false);
        }, 300);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [query]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (location: GeoLocation) => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        onLocationSelect(location);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="search-container fade-in" ref={wrapperRef}>
            <div className="search-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Поиск города..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="location-btn"
                    onClick={onGetCurrentLocation}
                    disabled={isLoading}
                    title="Определить местоположение"
                >
                    {isLoading ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32">
                                <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                        </svg>
                    )}
                </button>

                {showSuggestions && (
                    <div className="search-suggestions">
                        {isSearching ? (
                            <div className="suggestion-item">
                                <span className="city-name">Поиск...</span>
                            </div>
                        ) : (
                            suggestions.map((location, index) => (
                                <div
                                    key={`${location.lat}-${location.lon}-${index}`}
                                    className="suggestion-item"
                                    onClick={() => handleSelect(location)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <div>
                                        <span className="city-name">{location.name}</span>
                                        {location.admin1 && <span className="country">, {location.admin1}</span>}
                                        <span className="country">, {location.country}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;

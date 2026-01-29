import { useState, useEffect } from 'react'
import type { Region } from '@/db/schema'
import { Search } from 'lucide-react'
import { REGION_INFO } from '@/lib/const'

interface SearchFiltersProps {
  searchQuery: string
  selectedRegion: Region | 'all'
  onSearchChange: (query: string) => void
  onRegionChange: (region: Region | 'all') => void
}

export function SearchFilters({
  searchQuery,
  selectedRegion,
  onSearchChange,
  onRegionChange,
}: SearchFiltersProps) {
  const regions: Array<Region | 'all'> = ['all', 'KR', 'US']
  const [inputValue, setInputValue] = useState(searchQuery)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearchChange(inputValue)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [inputValue, searchQuery, onSearchChange])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(inputValue)
    }
  }

  return (
    <div className="mb-4 flex flex-col items-center gap-6">
      {/* Search Input */}
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요"
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 focus:bg-background border border-transparent focus:border-primary/20 text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 outline-none shadow-sm focus:shadow-md"
          aria-label="기사 검색"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {/* Region Filter - Segmented Control Style */}
      <div className="p-1 bg-secondary/30 rounded-full inline-flex relative">
        {regions.map((region) => {
          const isSelected = selectedRegion === region
          const regionInfo = REGION_INFO[region]

          return (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`
                relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer select-none
                ${
                  isSelected
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground/80'
                }
              `}
              aria-pressed={isSelected}
              aria-label={regionInfo.name}
            >
              {/* <span className="mr-1.5">{regionInfo.emoji}</span> */}
              {regionInfo.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

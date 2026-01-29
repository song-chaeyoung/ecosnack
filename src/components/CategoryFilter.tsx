import type { Category } from '@/db/schema'
import { CATEGORY_INFO } from '@/lib/const'

interface CategoryFilterProps {
  categories: Array<string>
  selectedCategory: Category | 'all'
  onCategoryChange: (category: Category | 'all') => void
}

export function CategoryFilter({
  categories: apiCategories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories: Array<Category | 'all'> = [
    'all',
    ...apiCategories,
  ] as Array<Category | 'all'>

  return (
    <div className="mb-6 w-full border-b border-border/40">
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:justify-center scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-6 sm:gap-10 min-w-max sm:min-w-0 px-2 pb-px">
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            const categoryInfo = CATEGORY_INFO[category]

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  group relative py-3 text-[15px] cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground font-medium hover:text-foreground/80'
                  }
                `}
                aria-pressed={isSelected}
                aria-label={categoryInfo.name}
              >
                <span className="relative z-10 px-1">{categoryInfo.name}</span>
                {isSelected && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary rounded-t-full shadow-[0_-2px_6px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-50 duration-200" />
                )}
                {!isSelected && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-transparent group-hover:bg-border/50 transition-colors duration-300 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

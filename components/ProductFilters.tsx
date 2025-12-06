import { X } from './Icons';

interface ProductFiltersProps {
  categories: string[];
  uluses: string[];
  selectedCategory: string | null;
  selectedUlys: string | null;
  sortBy: 'newest' | 'oldest' | 'none';
  onCategoryChange: (category: string | null) => void;
  onUlysChange: (ulys: string | null) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'none') => void;
  onReset: () => void;
}

export function ProductFilters({
  categories,
  uluses,
  selectedCategory,
  selectedUlys,
  sortBy,
  onCategoryChange,
  onUlysChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters = selectedCategory || selectedUlys || sortBy !== 'none';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Сбросить
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Фильтр по категории */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по улусу */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Улус
          </label>
          <select
            value={selectedUlys || ''}
            onChange={(e) => onUlysChange(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Все улусы</option>
            {uluses.map((ulys) => (
              <option key={ulys} value={ulys}>
                {ulys}
              </option>
            ))}
          </select>
        </div>

        {/* Сортировка по дате */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сортировка по дате
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'none')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="none">Без сортировки</option>
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </div>
      </div>
    </div>
  );
}


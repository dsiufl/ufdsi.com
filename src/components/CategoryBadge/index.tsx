export default function CategoryBadge({ category, track }: { category: string; track?: string }) {
    const categoryColors = {
      'keynote': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      'general': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'industry': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'research': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'workshop': 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
        {category === 'keynote' ? 'Keynote Speaker' : track || category}
      </span>
    );
  };
'use client';

import { usePathname, useRouter } from '@/lib/i18n';
import { useUIStore } from '@/store/ui-store';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  const handleLanguageChange = (newLanguage: 'en' | 'ja') => {
    setLanguage(newLanguage);
    router.replace(pathname, { locale: newLanguage });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded-md ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('ja')}
        className={`px-3 py-1 rounded-md ${
          language === 'ja'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        日本語
      </button>
    </div>
  );
} 
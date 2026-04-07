import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', key: 'langEnglish' },
  { code: 'ru', key: 'langRussian' },
  { code: 'tr', key: 'langTurkish' },
  { code: 'zh', key: 'langChinese' },
  { code: 'ja', key: 'langJapanese' },
  { code: 'ar', key: 'langArabic' },
  { code: 'ky', key: 'langKyrgyz' },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-zinc-400" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-zinc-900/30 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {t(lang.key)}
          </option>
        ))}
      </select>
    </div>
  );
}
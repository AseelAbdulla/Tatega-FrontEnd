import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // جلب اللغة من LocalStorage أو اعتماد العربية كافتراضية
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'ar');

  useEffect(() => {
    // حفظ اللغة وتحديث اتجاه وثيقة HTML تلقائياً
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const changeLanguage = (newLang) => {
    if (newLang === 'ar' || newLang === 'en') {
      setLang(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

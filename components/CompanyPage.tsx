import { useEffect, useState } from 'react';
import { Plus, ArrowLeft } from './Icons';

interface CompanyPageProps {
  onBack: () => void;
  onOpenProfile: () => void;
}

interface CompanyData {
  id?: string;
  name: string;
  description: string;
  contacts: string;
  deliveryMethod: string;
  createdAt?: string;
}

export function CompanyPage({ onBack, onOpenProfile }: CompanyPageProps) {
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  const loadCompanies = () => {
    const list = localStorage.getItem('companyProfiles');
    const single = localStorage.getItem('companyProfile');
    let parsed: CompanyData[] = [];
    if (list) {
      parsed = JSON.parse(list);
    }
    if (single) {
      const one = JSON.parse(single);
      const exists = parsed.find((c) => c.id && one.id && c.id === one.id) || parsed.find((c) => c.name === one.name);
      if (!exists) parsed = [...parsed, one];
    }
    setCompanies(parsed);
  };

  useEffect(() => {
    loadCompanies();
    const handler = () => loadCompanies();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              На главную
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Профиль компании</h2>
          </div>
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Добавить / редактировать
          </button>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-800 mb-3">Все компании ({companies.length})</h3>
          {companies.length === 0 ? (
            <div className="text-gray-600 text-sm">Пока нет сохраненных компаний.</div>
          ) : (
            <div className="space-y-3">
              {companies.map((c) => (
                <div key={c.id || c.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 font-semibold">{c.name || 'Без названия'}</p>
                      <p className="text-xs text-gray-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Дата не указана'}
                      </p>
                    </div>
                  </div>
                  {c.description && <p className="text-gray-700 text-sm mt-2">{c.description}</p>}
                  {c.contacts && <p className="text-gray-600 text-sm mt-1">Контакты: {c.contacts}</p>}
                  {c.deliveryMethod && <p className="text-gray-600 text-sm mt-1">Доставка: {c.deliveryMethod}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


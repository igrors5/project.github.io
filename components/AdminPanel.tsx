import { X, Plus } from './Icons';
import { useState } from 'react';

interface Promo {
  code: string;
  maxUses: number;
  used: number;
  createdAt: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  promos: Promo[];
  onCreatePromo: (data: { code: string; maxUses: number }) => void;
}

export function AdminPanel({ isOpen, onClose, promos, onCreatePromo }: AdminPanelProps) {
  const [code, setCode] = useState('');
  const [maxUses, setMaxUses] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePromo({ code, maxUses });
    setCode('');
    setMaxUses(10);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Админ-панель</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Промокод</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  placeholder="SALE2025"
                  required
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Макс. использований</label>
                <input
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Создать промокод
            </button>
          </form>

          <div>
            <h3 className="text-gray-800 mb-3">Список промокодов ({promos.length})</h3>
            {promos.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-gray-600 text-sm">
                Пока нет промокодов. Создайте первый сверху.
              </div>
            ) : (
              <div className="space-y-3">
                {promos.map((promo) => (
                  <div key={promo.code} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{promo.code}</p>
                      <p className="text-sm text-gray-500">Создан: {new Date(promo.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-700">
                        {promo.used}/{promo.maxUses} использований
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[120px]">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${Math.min(100, (promo.used / promo.maxUses) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


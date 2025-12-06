import { useState, useEffect } from 'react';
import { X, Edit2, Save } from './Icons';

interface CompanyProfileProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  onSave?: () => void;
}

interface CompanyData {
  name: string;
  description: string;
  contacts: string;
  deliveryMethod: string;
}

export function CompanyProfile({ isOpen, onClose, accessToken, onSave }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    description: '',
    contacts: '',
    deliveryMethod: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadCompanyData();
    }
  }, [isOpen, accessToken]);

  const loadCompanyData = async () => {
    // Загрузка данных компании из localStorage или API
    const saved = localStorage.getItem('companyProfile');
    if (saved) {
      setCompanyData(JSON.parse(saved));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Сохранение в localStorage (в реальном приложении - в API)
      localStorage.setItem('companyProfile', JSON.stringify(companyData));
      setIsEditing(false);
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Профиль компании</h2>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Редактировать
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Название компании</label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Введите название компании"
                  maxLength={50}
                />
              ) : (
                <p className="text-gray-800">{companyData.name || 'Не указано'}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Описание компании</label>
              {isEditing ? (
                <textarea
                  value={companyData.description}
                  onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] resize-y"
                  placeholder="Расскажите о вашей компании..."
                  maxLength={500}
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{companyData.description || 'Не указано'}</p>
              )}
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  {companyData.description.length}/500 символов
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Контакты</label>
              {isEditing ? (
                <textarea
                  value={companyData.contacts}
                  onChange={(e) => setCompanyData({ ...companyData, contacts: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
                  placeholder="Телефон, email, адрес и другие контакты..."
                  maxLength={300}
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{companyData.contacts || 'Не указано'}</p>
              )}
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  {companyData.contacts.length}/300 символов
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Способ доставки</label>
              {isEditing ? (
                <textarea
                  value={companyData.deliveryMethod}
                  onChange={(e) => setCompanyData({ ...companyData, deliveryMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
                  placeholder="Опишите способы доставки ваших товаров..."
                  maxLength={300}
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{companyData.deliveryMethod || 'Не указано'}</p>
              )}
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  {companyData.deliveryMethod.length}/300 символов
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


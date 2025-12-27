import { useState, useEffect } from 'react';
import { X, Edit2, Save } from './Icons';

interface CompanyProfileProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  onSave?: () => void;
  initialDataMode?: 'empty' | 'stored';
  forceEdit?: boolean;
}

interface CompanyData {
  name: string;
  description: string;
  contacts: string;
  deliveryMethod: string;
  logo?: string;
  sellerId?: string;
  id?: string;
  createdAt?: string;
}

export function CompanyProfile({ isOpen, onClose, accessToken, onSave, initialDataMode = 'stored', forceEdit = false }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    description: '',
    contacts: '',
    deliveryMethod: '',
    logo: '',
  });
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialDataMode === 'empty') {
      setCompanyData({
        name: '',
        description: '',
        contacts: '',
        deliveryMethod: '',
        logo: '',
      });
      setIsEditing(true);
      return;
    }
    if (accessToken) {
      loadCompanyData();
      if (forceEdit) {
        setIsEditing(true);
      }
    }
  }, [isOpen, accessToken, initialDataMode, forceEdit]);

  const loadCompanyData = async () => {
    const saved = localStorage.getItem('companyProfile');
    if (saved) {
      setCompanyData(JSON.parse(saved));
    }
    const list = localStorage.getItem('companyProfiles');
    if (list) {
      setCompanies(JSON.parse(list));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCompanyData({ ...companyData, logo: base64String });
    };
    reader.onerror = () => {
      alert('Ошибка при чтении файла');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCompanyData({ ...companyData, logo: '' });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Получаем sellerId из accessToken, если его еще нет
      let sellerId = companyData.sellerId;
      if (!sellerId && accessToken) {
        const session = (await import('../utils/localDB')).sessionDB.getByToken(accessToken);
        if (session) {
          sellerId = session.userId;
        }
      }

      const withMeta: CompanyData = {
        ...companyData,
        sellerId: sellerId || companyData.sellerId,
        id: companyData.id || Date.now().toString(36),
        createdAt: companyData.createdAt || new Date().toISOString(),
      };

      // Сохранение в localStorage (в реальном приложении - в API)
      localStorage.setItem('companyProfile', JSON.stringify(withMeta));

      // Добавляем/обновляем в списке компаний
      const existingList: CompanyData[] = companies.length ? companies : JSON.parse(localStorage.getItem('companyProfiles') || '[]');
      const updatedList = (() => {
        const idx = existingList.findIndex(c => c.id === withMeta.id || c.name === withMeta.name);
        if (idx >= 0) {
          const copy = [...existingList];
          copy[idx] = withMeta;
          return copy;
        }
        return [...existingList, withMeta];
      })();
      localStorage.setItem('companyProfiles', JSON.stringify(updatedList));
      setCompanies(updatedList);
      setCompanyData(withMeta);
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
            <h2 className="text-gray-900">Профиль производителя</h2>
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
              <label className="block text-gray-700 mb-2 font-medium">Логотип компании</label>
              {isEditing ? (
                <div className="space-y-3">
                  {companyData.logo ? (
                    <div className="relative inline-block">
                      <img
                        src={companyData.logo}
                        alt="Логотип"
                        className="w-32 h-32 object-contain border border-gray-300 rounded-lg p-2 bg-white"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <span className="text-gray-400 text-sm text-center px-2">Нет логотипа</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Загрузить логотип (JPG, PNG, до 5MB)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {companyData.logo ? (
                    <img
                      src={companyData.logo}
                      alt="Логотип компании"
                      className="w-32 h-32 object-contain border border-gray-300 rounded-lg p-2 bg-white"
                    />
                  ) : (
                    <p className="text-gray-500 italic">Логотип не загружен</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Название производителя</label>
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
              <label className="block text-gray-700 mb-2 font-medium">Описание производителя</label>
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

          <div className="mt-8">
            <h3 className="text-gray-900 mb-3">Сохраненные производители ({companies.length})</h3>
            {companies.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">Пока нет сохраненных компаний.</div>
            ) : (
              <div className="space-y-3">
                {companies.map((c) => (
                  <div key={c.id || c.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {c.logo && (
                          <img
                            src={c.logo}
                            alt="Логотип"
                            className="w-16 h-16 object-contain border border-gray-300 rounded-lg p-1 bg-white"
                          />
                        )}
                        <div>
                          <p className="text-gray-900 font-semibold">{c.name || 'Без названия'}</p>
                          <p className="text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCompanyData(c);
                          setIsEditing(true);
                        }}
                        className="text-indigo-600 text-sm hover:underline"
                      >
                        Редактировать
                      </button>
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
    </div>
  );
}


import { Plus, Trash2 } from './Icons';
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  ulys?: string;
  stock?: number;
  discountPercent?: number;
  features?: string;
  characteristics?: string;
  quantity?: number;
  hidden?: boolean;
}

interface SellerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: () => void;
  onCompanyProfile: () => void;
  onDeleteProduct?: (productId: number) => void;
  salesData?: Array<{ name: string; sales: number }>;
  onMakeAdmin?: () => void;
  isSeller?: boolean;
  onUpdateProduct?: (productId: number, data: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    ulys: string;
    stock: number;
    discountPercent: number;
    features: string;
  }) => void;
}

export function SellerDashboard({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onCompanyProfile,
  onDeleteProduct,
  salesData = [],
  onMakeAdmin,
  isSeller,
  onUpdateProduct,
}: SellerDashboardProps) {
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    ulys: '',
    stock: '',
    discountPercent: '',
    features: '',
  });

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Панель производителя</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Закрыть
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={onCompanyProfile}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            Профиль компании
          </button>
          <button
            onClick={onAddProduct}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить товар
          </button>
          {!isSeller && onMakeAdmin && (
            <button
              onClick={onMakeAdmin}
              className="bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition text-sm"
            >
              Стать продавцом
            </button>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-gray-800 mb-3">Продажи по товарам</h3>
          {salesData.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-gray-600 text-sm">Нет данных по продажам.</div>
          ) : (
            <ChartContainer
              id="sales-chart"
              config={{
                sales: {
                  label: 'Продажи',
                  color: 'hsl(234, 83%, 60%)',
                },
              }}
              className="w-full h-64 border border-gray-200 rounded-lg"
            >
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-gray-800 mb-3">Активные продажи (со скидкой)</h3>
          {products.filter(p => p.discountPercent && p.discountPercent > 0 && (p.stock ?? 0) > 0).length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-gray-600 text-sm">Нет активных скидок.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products
                .filter(p => p.discountPercent && p.discountPercent > 0 && (p.stock ?? 0) > 0)
                .map(p => (
                  <div key={p.id} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-600">Скидка: {p.discountPercent}%</p>
                      </div>
                      <span className="text-indigo-600 font-semibold">
                        {Math.round(p.price * (1 - (p.discountPercent ?? 0) / 100)).toLocaleString()} ₽
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Остаток: {p.stock ?? 0}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-gray-800 mb-4">Мои товары ({products.length})</h3>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">У вас пока нет товаров</p>
              <p className="text-gray-400 text-sm mt-2">Нажмите "Добавить товар" чтобы начать</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition relative">
                  <div className="flex gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{product.name}</h4>
                      <p className="text-indigo-600 mb-2">{product.price.toLocaleString()} ₽</p>
                      <p className="text-gray-500 text-sm">{product.category}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.stock !== undefined
                          ? `Остаток: ${product.stock}`
                          : product.quantity !== undefined
                          ? `В наличии: ${product.quantity}`
                          : 'Количество не указано'}
                      </p>
                      {product.hidden && (
                        <span className="inline-block mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          Скрыт
                        </span>
                      )}
                      {product.discountPercent && product.discountPercent > 0 && (
                        <span className="inline-block mt-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                          Скидка {product.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                  {product.description && (
                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">{product.description}</p>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {onDeleteProduct && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        title="Удалить товар"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {onUpdateProduct && (
                      <button
                        onClick={() => {
                          setEditProductId(product.id);
                          setEditForm({
                            name: product.name,
                            price: String(product.price),
                            image: product.image,
                            category: product.category,
                            description: product.description || '',
                            ulys: product.ulys || '',
                            stock: String(product.stock ?? 0),
                            discountPercent: String(product.discountPercent ?? 0),
                            features: product.features || '',
                          });
                        }}
                        className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-100 transition text-sm"
                        title="Редактировать"
                      >
                        Редактировать
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {onUpdateProduct && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-gray-900 mb-3">Редактирование товара</h3>
            {editProductId === null ? (
              <p className="text-sm text-gray-600">Выберите товар «Редактировать» чтобы загрузить данные в форму.</p>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateProduct(editProductId, {
                    name: editForm.name,
                    price: Number(editForm.price),
                    image: editForm.image,
                    category: editForm.category,
                    description: editForm.description,
                    ulys: editForm.ulys,
                    stock: Number(editForm.stock),
                    discountPercent: Number(editForm.discountPercent),
                    features: editForm.features,
                  });
                }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Название</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Цена</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      min={0}
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">URL изображения</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Категория</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Улус</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.ulys}
                      onChange={(e) => setEditForm({ ...editForm, ulys: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Остаток (лимит)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      min={0}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Скидка, %</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.discountPercent}
                      onChange={(e) => setEditForm({ ...editForm, discountPercent: e.target.value })}
                      min={0}
                      max={90}
                    />
                    <p className="text-xs text-gray-500 mt-1">Итоговая цена обновится по скидке.</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Описание</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Особенности / характеристики</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editForm.features}
                    onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Сохранить изменения
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProductId(null)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


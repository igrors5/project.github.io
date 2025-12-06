import { X, Plus } from './Icons';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface SellerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: () => void;
  onCompanyProfile: () => void;
}

export function SellerDashboard({ isOpen, onClose, products, onAddProduct, onCompanyProfile }: SellerDashboardProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Панель производителя</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 flex gap-4">
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
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
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
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">{product.description}</p>
                    )}
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

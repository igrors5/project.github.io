import { X, Minus, Plus, Trash2 } from './Icons';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout?: () => void;
}

export function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl text-gray-900">Корзина</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Ваша корзина пуста</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-indigo-600 mb-2">{item.price.toLocaleString()} ₽</p>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="bg-gray-200 hover:bg-gray-300 rounded p-1 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded p-1 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">Итого:</span>
              <span className="text-2xl text-gray-900">{total.toLocaleString()} ₽</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Оформить заказ
            </button>
            <button 
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Продолжить покупки
            </button>
          </div>
        )}
      </div>
    </>
  );
}
import { X, ShoppingCart, Heart, Minus, Plus } from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useMemo, useState } from 'react';
import { Product } from '../utils/localDB';
import type { Promo } from '../utils/localDB';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (quantity: number) => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
  promos?: Promo[];
}

export function ProductModal({ 
  isOpen, 
  onClose, 
  product, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist,
  promos = [],
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const available = useMemo(() => {
    if (product.stock !== undefined) return product.stock;
    if (product.quantity !== undefined) return product.quantity;
    return Infinity;
  }, [product.stock, product.quantity]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (available <= 0) return;
    const safeQty = Math.max(1, Math.min(quantity, available === Infinity ? quantity : available));
    onAddToCart(safeQty);
    onClose();
  };

  const incrementQuantity = () => {
    setQuantity(prev => {
      const next = prev + 1;
      if (available === Infinity) return next;
      return Math.min(next, available);
    });
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoStatus({ type: 'error', message: 'Введите промокод' });
      return;
    }
    const promo = promos.find(p => p.code.toLowerCase() === promoCode.trim().toLowerCase());
    if (!promo) {
      setPromoStatus({ type: 'error', message: 'Промокод не найден' });
      return;
    }
    if (promo.used >= promo.maxUses) {
      setPromoStatus({ type: 'error', message: 'Лимит промокода исчерпан' });
      return;
    }
    setPromoStatus({ type: 'success', message: 'Промокод применен' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-gray-900">Детали товара</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <ImageWithFallback
                src={product.image || "https://avatars.mds.yandex.net/i?id=391a6172a397ce425b6374d4463d3edec81ab7dd-10397524-images-thumbs&n=13"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <button
                onClick={onToggleWishlist}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-indigo-50 transition"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
              <div className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full">
                {product.category}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h3 className="text-gray-900 mb-4">{product.name}</h3>
              <div className="text-indigo-600 text-3xl mb-6">
                {product.discountPercent && product.discountPercent > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-indigo-600">
                      {Math.round(product.price * (1 - product.discountPercent / 100)).toLocaleString()} ₽
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <span className="text-sm text-amber-600">-{product.discountPercent}%</span>
                  </div>
                ) : (
                  <span>{product.price.toLocaleString()} ₽</span>
                )}
                {product.stock !== undefined && (
                  <p className="text-sm text-gray-500">Остаток: {product.stock}</p>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-4">
                {product.stock !== undefined
                  ? `Остаток на складе: ${product.stock}`
                  : product.quantity !== undefined
                  ? `В наличии: ${product.quantity}`
                  : 'Количество не указано'}
              </div>

              <div className="mb-6">
                <h4 className="text-gray-700 mb-2">Описание</h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description?.trim() || 'Описание не указано'}
                </p>
              </div>

              {product.features && (
                <div className="mb-6">
                  <h4 className="text-gray-700 mb-2">Особенности</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {product.features}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-gray-700 mb-3">Характеристики</h4>
                {(() => {
                  const characteristics = product.characteristics
                    ?.split(/\r?\n/)
                    .map(c => c.trim())
                    .filter(Boolean);
                  if (characteristics && characteristics.length > 0) {
                    return (
                      <ul className="space-y-2 text-gray-600">
                        {characteristics.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p className="text-gray-500">Характеристики не указаны</p>;
                })()}
              </div>

              <div className="mb-6">
                <h4 className="text-gray-700 mb-3">Количество</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-700 mb-3">Промокод</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Введите промокод"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Применить
                    </button>
                  </div>
                  {promoStatus && (
                    <div
                      className={`text-sm ${
                        promoStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {promoStatus.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={available !== Infinity && available <= 0}
                  className={`w-full py-3 rounded-lg transition flex items-center justify-center gap-2 ${
                    available !== Infinity && available <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {available !== Infinity && available <= 0 ? 'Нет в наличии' : 'Добавить в корзину'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Продолжить покупки
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

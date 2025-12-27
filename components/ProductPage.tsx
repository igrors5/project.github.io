import { useState, useMemo } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus } from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../utils/localDB';
import type { Promo } from '../utils/localDB';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (quantity: number) => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
  promos?: Promo[];
  companyInfo?: {
    name: string;
    description: string;
    contacts: string;
    deliveryMethod: string;
    logo?: string;
  } | null;
}

export function ProductPage({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  promos = [],
  companyInfo,
}: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const available = useMemo(() => {
    if (product.stock !== undefined) return product.stock;
    if (product.quantity !== undefined) return product.quantity;
    return Infinity;
  }, [product.stock, product.quantity]);

  const handleAddToCart = () => {
    if (available <= 0) return;
    const safeQty = Math.max(1, Math.min(quantity, available === Infinity ? quantity : available));
    onAddToCart(safeQty);
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

  const finalPrice = product.discountPercent && product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="text-indigo-600 text-4xl mb-6">
                {product.discountPercent && product.discountPercent > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-indigo-600">
                      {finalPrice.toLocaleString()} ₽
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">-{product.discountPercent}%</span>
                  </div>
                ) : (
                  <span>{product.price.toLocaleString()} ₽</span>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-6">
                {product.stock !== undefined
                  ? `Остаток на складе: ${product.stock}`
                  : product.quantity !== undefined
                  ? `В наличии: ${product.quantity}`
                  : 'Количество не указано'}
              </div>

              {/* Ulys */}
              {product.ulys && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Улус:</span> {product.ulys}
                  </p>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Количество</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Promo code */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Промокод</h4>
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
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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

              {/* Add to cart button */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={available !== Infinity && available <= 0}
                  className={`w-full py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg font-medium ${
                    available !== Infinity && available <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {available !== Infinity && available <= 0 ? 'Нет в наличии' : 'Добавить в корзину'}
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Information Section */}
          <div className="border-t border-gray-200 px-8 py-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Product Information */}
              <div className="space-y-6">
                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Описание товара</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {product.description.trim()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Characteristics */}
                {product.characteristics && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Характеристики</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {(() => {
                        const characteristics = product.characteristics
                          ?.split(/\r?\n/)
                          .map(c => c.trim())
                          .filter(Boolean);
                        if (characteristics && characteristics.length > 0) {
                          return (
                            <ul className="space-y-3 text-gray-700">
                              {characteristics.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return <p className="text-gray-500">Характеристики не указаны</p>;
                      })()}
                    </div>
                  </div>
                )}

                {/* Features */}
                {product.features && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Особенности</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {product.features}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Company Information */}
              <div>
                {companyInfo && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">О производителе</h3>
                    <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-100">
                      {companyInfo.logo && (
                        <div className="mb-4">
                          <img 
                            src={companyInfo.logo} 
                            alt={companyInfo.name}
                            className="w-24 h-24 object-contain rounded-lg bg-white p-2"
                          />
                        </div>
                      )}
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{companyInfo.name}</h4>
                      {companyInfo.description && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Описание:</p>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {companyInfo.description}
                          </p>
                        </div>
                      )}
                      {companyInfo.contacts && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Контакты:</p>
                          <p className="text-sm text-gray-600">{companyInfo.contacts}</p>
                        </div>
                      )}
                      {companyInfo.deliveryMethod && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Способ доставки:</p>
                          <p className="text-sm text-gray-600">{companyInfo.deliveryMethod}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!companyInfo && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">О производителе</h3>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <p className="text-gray-500 text-sm">Информация о производителе не указана</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


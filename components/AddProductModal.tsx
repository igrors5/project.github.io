import { useState } from 'react';
import { X } from './Icons';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    characteristics: string;
    quantity: number;
    ulys: string;
  }) => void;
}

const categories = [
  'Традиционные ремесла',
  'Украшения',
  'Одежда и текстиль',
  'Деревянные изделия',
  'Продукты питания',
];

const uluses = [
  'Абыйский улус - Абый улууһа (административный центр п. Белая Гора)',
  'Алданский район - Алдан улууһа (административный центр г. Алдан)',
  'Аллаиховский улус - Аллайыаха улууhа (административный центр п. Чокурдах)',
  'Амгинский улус - Амма улууһа (административный центр с. Амга)',
  'Анабарский национальный (долгано-эвенкийский) улус - Анаабыр улууhа (административный центр с. Саскылах)',
  'Булунский улус - Булуҥ улууһа (административный центр п. Тикси)',
  'Верхневилюйский улус – Үөһээ Бүлүү улууһа (административный центр с. Верхневилюйск)',
  'Верхнеколымский улус - Үөһээ Халыма улууһа (административный центр п. Зырянка)',
  'Верхоянский улус - Үөһээ Дьааҥы улууһа (административный центр п. Батагай)',
  'Вилюйский улус - Бүлүү улууһа (административный центр г. Вилюйск)',
  'Горный улус - Горнай улууhа (административный центр с. Бердигестях)',
  'Жиганский национальный эвенкийский улус - Эдьигээн улууһа (административный центр с. Жиганск)',
  'Кобяйский улус - Кэбээйи улууһа (административный центр п. Сангар)',
  'Ленский район - Ленскэй улууһа (административный центр г. Ленск)',
  'Мегино-Кангаласский улус - Мэҥэ Хаҥалас улууһа (административный центр п. Нижний Бестях)',
  'Мирнинский район - Мирнэй улууһа (административный центр г. Мирный)',
  'Момский район - Муома улууһа (административный центр с. Хонуу)',
  'Намский улус - Нам улууһа (административный центр с. Намцы)',
  'Нерюнгринский район - Нүөрүҥгүрү улууhа (административный центр г. Нерюнгри)',
  'Нижнеколымский улус - Аллараа Халыма улууhа (административный центр п. Черский)',
  'Нюрбинский улус - Ньурба улууһа (административный центр г. Нюрба)',
  'Оймяконский улус - Өймөкөөн улууhа (административный центр п. Усть-Нера)',
  'Оленёкский национальный эвенкийский улус - Өлөөн улууһа (административный центр с. Оленек)',
  'Олёкминский улус - Өлүөхүмэ улууһа (административный центр г. Олекминск)',
  'Среднеколымский улус - Орто Халыма улууhа (административный центр г. Среднеколымск)',
  'Сунтарский улус - Сунтаар улууһа (административный центр с. Сунтар)',
  'Таттинский улус - Таатта улууһа (административный центр с. Ытык-Кюель)',
  'Томпонский район - Томпо улууhа (административный центр п. Хандыга)',
  'Усть-Алданский улус - Уус-Алдан улууһа (административный центр с. Борогонцы)',
  'Усть-Майский улус - Уус-Маайа улууhа (административный центр п. Усть-Мая)',
  'Усть-Янский улус - Усуйаана улууһа (административный центр п. Депутатский)',
  'Хангаласский улус - Хаҥалас улууhа (административный центр г. Покровск)',
  'Чурапчинский улус - Чурапчы улууhа (административный центр с. Чурапча)',
  'Эвено-Бытантайский национальный улус - Эбээн-Бытантай улууhа (административный центр с. Батагай-Алыта)',
];

export function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [ulys, setUlys] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price: Number(price),
      image,
      category,
      description,
      characteristics,
      quantity: Number(quantity) || 0,
      ulys,
    });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage('');
    setCategory(categories[0]);
    setDescription('');
    setCharacteristics('');
    setQuantity('1');
    setUlys('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Добавить товар</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Название товара *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Цена (₽) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">URL изображения</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Категория *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Количество доступно *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Описание</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
                placeholder="Расскажите о вашем товаре..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Характеристики (каждая с новой строки)</label>
              <textarea
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
                placeholder="Например: материал, размеры, цвет..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Улус</label>
              <select
                value={ulys}
                onChange={(e) => setUlys(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Выберите улус</option>
                {uluses.map((ulysOption) => (
                  <option key={ulysOption} value={ulysOption}>
                    {ulysOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Добавить товар
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

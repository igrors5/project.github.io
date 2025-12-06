import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onShopClick: () => void;
  onLearnClick: () => void;
}

export function Hero({ onShopClick, onLearnClick }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1742940402380-142bb72d1b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBsYW5kc2NhcGUlMjB5YWt1dHNrfGVufDF8fHx8MTc2NDI0ODk2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Yakutsk winter landscape"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Аутентичные якутские товары
          </h2>
          <p className="text-xl sm:text-2xl mb-8 text-indigo-100">
            Откройте для себя уникальные изделия ручной работы, традиционные ремесла и местные продукты из сердца Якутии
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onShopClick}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition"
            >
              Смотреть товары
            </button>
            <button 
              onClick={onLearnClick}
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
            >
              Узнать больше
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
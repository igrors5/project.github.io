import { Mail, Phone, MapPin } from './Icons';

interface FooterProps {
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
  onAboutClick?: () => void;
  quickLinksMode?: 'full' | 'aboutOnly';
}

export function Footer({ onShowToast, onAboutClick, quickLinksMode = 'full' }: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSocialClick = (platform: string) => {
    if (onShowToast) {
      onShowToast(`Подписывайтесь на нас в ${platform}!`, 'info');
    }
  };

  const handleServiceClick = (service: string) => {
    if (onShowToast) {
      onShowToast(`Раздел "${service}" скоро будет доступен!`, 'info');
    }
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+79141111111';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@yktshop.ru';
  };

  const handleAddressClick = () => {
    if (onShowToast) {
      onShowToast('Открываем карту...', 'info');
    }
    // В реальном приложении здесь был бы переход на карты
    window.open('https://yandex.ru/maps/?text=Якутск', '_blank');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white mb-4">Ykt Product</h3>
            <p className="text-sm text-gray-400 mb-4">
              Мы продвигаем традиционные якутские ремесла и местные продукты, связывая мастеров с клиентами.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSocialClick('ВКонтакте')}
                className="hover:text-white transition cursor-pointer"
                aria-label="ВКонтакте"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.35 14.63h-1.4c-.46 0-.6-.37-1.42-1.19-.72-.69-1.04-.78-1.22-.78-.25 0-.32.07-.32.41v1.08c0 .29-.09.46-1.13.46-1.68 0-3.55-.95-4.87-2.72-1.99-2.59-2.54-4.54-2.54-4.94 0-.18.07-.35.41-.35h1.4c.31 0 .43.14.55.48.64 1.84 1.74 3.45 2.19 3.45.17 0 .24-.08.24-.5v-1.97c-.06-.98-.57-1.06-.57-1.41 0-.15.12-.3.32-.3h2.2c.26 0 .36.14.36.44v2.65c0 .26.11.36.19.36.17 0 .3-.1.61-.41 1.07-1.2 1.83-3.06 1.83-3.06.1-.21.24-.41.61-.41h1.4c.34 0 .42.17.34.44-.16.79-1.87 3.39-1.87 3.39-.14.23-.19.33 0 .59.14.19.6.59.91.95.55.64 1.07 1.18 1.2 1.55.12.38-.07.57-.45.57z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleSocialClick('Телеграм')}
                className="hover:text-white transition cursor-pointer"
                aria-label="Телеграм"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-sm">
              {quickLinksMode === 'full' && (
                <>
                  <li>
                    <button 
                      onClick={() => scrollToSection('home')}
                      className="hover:text-white transition cursor-pointer text-left"
                    >
                      Главная
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('products')}
                      className="hover:text-white transition cursor-pointer text-left"
                    >
                      Товары
                    </button>
                  </li>
                </>
              )}
              <li>
                <button 
                  onClick={() => {
                    if (onAboutClick) {
                      onAboutClick();
                    } else {
                      handleServiceClick('О нас');
                    }
                  }}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  О нас
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleServiceClick('Помощь')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Помощь
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('Доставка')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Доставка
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('Возврат')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Возврат
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('FAQ')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('Оплата')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Оплата
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={handleAddressClick}
                  className="flex items-start gap-2 hover:text-white transition cursor-pointer text-left"
                >
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>г. Якутск, Республика Саха (Якутия)</span>
                </button>
              </li>
              <li>
                <a
                  href="tel:+79141111111"
                  onClick={handlePhoneClick}
                  className="flex items-center gap-2 hover:text-white transition cursor-pointer"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+7 (914) 111-11-11</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@yktshop.ru"
                  onClick={handleEmailClick}
                  className="flex items-center gap-2 hover:text-white transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@yktshop.ru</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Якутские Товары. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
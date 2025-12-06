import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from './Icons';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
  response: string;
}

const quickReplies: QuickReply[] = [
  {
    id: 'delivery',
    text: 'Как работает доставка?',
    response: 'Мы доставляем товары по всей Республике Саха (Якутия). Стоимость доставки зависит от вашего местоположения и составляет от 300 до 1500 рублей. Доставка в пределах Якутска занимает 1-2 дня, в другие города республики - 3-7 дней. Бесплатная доставка при заказе от 10 000 рублей!'
  },
  {
    id: 'payment',
    text: 'Какие способы оплаты доступны?',
    response: 'Мы принимаем следующие способы оплаты: наличные при получении, банковские карты (Visa, MasterCard, МИР), онлайн-переводы через Сбербанк Онлайн, оплата через СБП (Система Быстрых Платежей). Все платежи полностью безопасны.'
  },
  {
    id: 'authenticity',
    text: 'Как проверить подлинность товаров?',
    response: 'Все наши товары изготовлены местными якутскими мастерами и ремесленниками. Каждое изделие проходит проверку качества и поставляется с сертификатом подлинности. Вы можете связаться с производителем напрямую через наш сайт.'
  },
  {
    id: 'return',
    text: 'Можно ли вернуть товар?',
    response: 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в использовании и сохранена его товарная форма. Возврат денег осуществляется в течение 5-10 рабочих дней. Стоимость обратной доставки оплачивает покупатель, если товар надлежащего качества.'
  },
  {
    id: 'seller',
    text: 'Как стать производителем на платформе?',
    response: 'Чтобы стать производителем, зарегистрируйтесь на сайте, выбрав тип учетной записи "Производитель". После регистрации вы сможете добавлять свои товары, управлять заказами и получать оплату. Мы взимаем комиссию 10% с каждой продажи.'
  },
  {
    id: 'contact',
    text: 'Как с вами связаться?',
    response: 'Вы можете связаться с нами:\n📞 Телефон: +7 (4112) 12-34-56\n📧 Email: info@yakutcraft.ru\n📍 Адрес: г. Якутск, ул. Кирова, 25\n⏰ Режим работы: Пн-Пт 9:00-18:00'
  }
];

const botResponses: { [key: string]: string } = {
  'привет': 'Здравствуйте! Я виртуальный помощник магазина якутских товаров. Чем могу помочь?',
  'здравствуй': 'Здравствуйте! Я виртуальный помощник магазина якутских товаров. Чем могу помочь?',
  'помощь': 'Выберите один из быстрых вопросов ниже или напишите свой вопрос. Я постараюсь помочь!',
  'товар': 'У нас есть традиционные якутские ремесла, украшения, одежда и текстиль, деревянные изделия. Вы можете посмотреть все категории на главной странице.',
  'цена': 'Цены на наши товары варьируются от 2 500 до 25 000 рублей. Все цены указаны в российских рублях.',
  'спасибо': 'Пожалуйста! Рад был помочь. Если возникнут ещё вопросы, обращайтесь!',
  'default': 'К сожалению, я не могу ответить на этот вопрос. Пожалуйста, выберите один из быстрых вопросов или свяжитесь с нашей службой поддержки по телефону +7 (4112) 12-34-56.'
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я виртуальный помощник магазина якутских товаров. Выберите вопрос или напишите свой.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check for exact quick reply matches
    const quickReply = quickReplies.find(qr => 
      lowerMessage.includes(qr.text.toLowerCase())
    );
    if (quickReply) return quickReply.response;

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    return botResponses['default'];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(inputValue);
      addMessage(response, 'bot');
    }, 1000);
  };

  const handleQuickReply = (reply: QuickReply) => {
    addMessage(reply.text, 'user');
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(reply.response, 'bot');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50 hover:scale-110"
        aria-label="Открыть чат"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white">Помощник</h3>
                <p className="text-indigo-100 text-xs">Онлайн</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'bot'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[75%] ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-2xl ${
                      message.sender === 'bot'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Быстрые вопросы:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.slice(0, 3).map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

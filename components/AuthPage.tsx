import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowLeft } from './Icons';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
  onRecoveryRequest: (params: { email?: string; hasNoEmail: boolean; comment?: string }) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onSignup, onRecoveryRequest, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [hasNoEmail, setHasNoEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      onSignup(email, password, name);
    }
  };

  const handleRecovery = () => {
    onRecoveryRequest({ email, hasNoEmail, comment });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-indigo-600 transition inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <div className="text-center mt-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Добро пожаловать в Ykt Product
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div>
              <label className="block text-gray-700 mb-1">Имя</label>
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="Ваше имя"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none text-gray-800"
                placeholder="you@example.com"
                required={!hasNoEmail}
                disabled={hasNoEmail}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-500 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNoEmail}
                onChange={(e) => setHasNoEmail(e.target.checked)}
              />
              Нет доступа к почте
            </label>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Пароль</label>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none text-gray-800"
                placeholder="••••••••"
                required={!hasNoEmail}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {mode === 'login' ? 'Создать аккаунт' : 'У меня уже есть аккаунт'}
          </button>
          {mode === 'login' && (
            <button
              onClick={handleRecovery}
              className="text-gray-500 hover:text-indigo-600"
            >
              Забыли пароль?
            </button>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-1 text-sm">Комментарий к восстановлению (опционально)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            rows={2}
            placeholder="Опишите проблему, если нужно"
          />
        </div>
      </div>
    </div>
  );
}


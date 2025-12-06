import { useState } from 'react';
import { X } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string, userType: 'buyer' | 'seller') => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      onSignup(email, password, name, userType);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setUserType('buyer');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = () => {
    resetForm();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-gray-700 mb-2">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                minLength={6}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-gray-700 mb-2">Тип аккаунта</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="buyer"
                      checked={userType === 'buyer'}
                      onChange={(e) => setUserType(e.target.value as 'buyer' | 'seller')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Покупатель</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="seller"
                      checked={userType === 'seller'}
                      onChange={(e) => setUserType(e.target.value as 'buyer' | 'seller')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Производитель</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={switchMode}
              className="text-indigo-600 hover:text-indigo-700 transition"
            >
              {mode === 'login'
                ? 'Нет аккаунта? Зарегистрируйтесь'
                : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
  onRecoveryRequest: (data: { email?: string; hasNoEmail: boolean; comment?: string }) => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup, onRecoveryRequest }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'help'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string>('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryComment, setRecoveryComment] = useState('');
  const [hasNoEmail, setHasNoEmail] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');

  if (!isOpen) return null;

  const validateName = (nameValue: string): boolean => {
    if (nameValue.trim().length < 2) {
      setNameError('Имя должно содержать минимум 2 символа');
      return false;
    }
    if (nameValue.trim().length > 16) {
      setNameError('Имя не должно превышать 16 символов');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      if (validateName(name)) {
        onSignup(email, password, name.trim());
      }
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim() && !hasNoEmail) {
      setRecoveryError('Укажите email или отметьте, что нет доступа к почте');
      return;
    }

    setRecoveryError('');
    onRecoveryRequest({
      email: recoveryEmail.trim() || undefined,
      hasNoEmail,
      comment: recoveryComment.trim() || undefined,
    });
    resetForm();
    setMode('login');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setNameError('');
    setRecoveryEmail('');
    setRecoveryComment('');
    setHasNoEmail(false);
    setRecoveryError('');
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    onClose();
  };

  const switchMode = () => {
    resetForm();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

          <form onSubmit={mode === 'help' ? handleRecoverySubmit : handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-gray-700 mb-2">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) {
                      validateName(e.target.value);
                    }
                  }}
                  onBlur={() => validateName(name)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    nameError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                  required
                  minLength={2}
                  maxLength={16}
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-500">{nameError}</p>
                )}
                {!nameError && name.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {name.length}/16 символов
                  </p>
                )}
              </div>
            )}

            {mode !== 'help' && (
              <>
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
              </>
            )}

            {mode === 'help' && (
              <>
                <div className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-900">
                  <p className="font-medium">Поможем восстановить доступ</p>
                  <p className="mt-1 text-indigo-800">
                    Укажите email, если помните его, или отметьте, что нет доступа к почте. Мы свяжемся через чат и подскажем, как восстановить пароль вручную.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email (если есть доступ)</label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={hasNoEmail}
                    onChange={(e) => setHasNoEmail(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Нет доступа к почте — хочу восстановить через поддержку</span>
                </label>

                <div>
                  <label className="block text-gray-700 mb-2">Комментарий (телефон/мессенджер для связи)</label>
                  <textarea
                    value={recoveryComment}
                    onChange={(e) => setRecoveryComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Например: свяжитесь в Telegram @username"
                  />
                </div>

                {recoveryError && (
                  <p className="text-sm text-red-500">{recoveryError}</p>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {mode === 'login' && 'Войти'}
              {mode === 'signup' && 'Зарегистрироваться'}
              {mode === 'help' && 'Отправить запрос'}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {mode !== 'help' ? (
              <>
                <button
                  onClick={switchMode}
                  className="block w-full text-indigo-600 hover:text-indigo-700 transition"
                >
                  {mode === 'login'
                    ? 'Нет аккаунта? Зарегистрируйтесь'
                    : 'Уже есть аккаунт? Войдите'}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setMode('help');
                  }}
                  className="block w-full text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  Забыли пароль или нет доступа к почте?
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  resetForm();
                  setMode('login');
                }}
                className="block w-full text-indigo-600 hover:text-indigo-700 transition"
              >
                Вернуться к входу
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

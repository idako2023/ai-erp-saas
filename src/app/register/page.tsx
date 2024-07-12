'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsername(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCheckingUsername(true);
    setIsUsernameAvailable(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.post('/api/auth/register/check-name', { name: value });
        setIsUsernameAvailable(response.data.available);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingUsername(false);
      }
    }, 1000); // 1秒后触发
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!isUsernameAvailable) {
      setError('Username is already taken');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post('/api/auth/register', { email, password, name: username });
      router.push('/chatbot');
    } catch (error) {
      console.error(error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl mb-4 text-center">用户信息</h1>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="用户名（长度为8位的英文或数字）"
          className={`w-full p-2 mb-4 border rounded text-gray-800 ${!isUsernameAvailable ? 'border-red-500' : ''}`}
          required
        />
        {checkingUsername && <p className="text-blue-500 text-sm">检查用户名是否可用...</p>}
        {!isUsernameAvailable && !checkingUsername && <p className="text-red-500 text-sm">用户名已被占用</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱"
          className="w-full p-2 mb-4 border rounded text-gray-800"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          className="w-full p-2 mb-4 border rounded text-gray-800"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-secondary bg-indigo-600 text-white rounded"
          disabled={isSubmitting || !isUsernameAvailable || checkingUsername}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;

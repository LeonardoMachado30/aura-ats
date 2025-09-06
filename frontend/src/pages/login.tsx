// frontend/pages/login.tsx
import logo from '@/assets/logo.svg';
import styles from '@/styles/login.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Chamada para API externa
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem('uid', data.uid);
        router.push('/atividades/agendas');
      } else {
        setError(data.error || 'Erro ao fazer login.');
      }
    } catch (error: any) {
      if (error?.response) {
        const status = error.response.status;
        if (status === 401) {
          setError('Usuário ou senha incorretos. Por favor, tente novamente.');
        } else if (status === 404) {
          setError(
            'Serviço de autenticação não encontrado. Tente novamente mais tarde.'
          );
        } else if (status === 500) {
          setError(
            'Erro interno do servidor. Por favor, tente novamente mais tarde.'
          );
        } else if (error.response.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
        }
      } else {
        setError(
          'Não foi possível conectar ao servidor. Verifique sua conexão.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <Image src={logo} width={30} height={30} alt="Logo Aura" />
          <span className="text-[#8C53FF] font-bold text-2xl">
            A<span className="text-[#545454]">U</span>RA ATS
          </span>
        </div>
        <form onSubmit={handleSubmit} method="POST" style={{ width: '100%' }}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Usuário:
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <Link href="#" className={styles.forgotPassword}>
          Esqueceu a senha?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

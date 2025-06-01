import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { useRef } from 'react';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>('Verificando seu e-mail...');
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Usar useRef para rastrear se a requisição já foi enviada
  const hasFetched = useRef(false);

  useEffect(() => {
    // Verifica se a requisição já foi feita para evitar chamadas duplicadas (especialmente em StrictMode)
    if (hasFetched.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      setMessage('Token de verificação não encontrado na URL.');
      setIsError(true);
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      hasFetched.current = true; // Marca que a requisição foi iniciada

      try {
        // Substitua 'http://localhost:3000' pela URL base do seu backend NestJS
        const response = await fetch(`http://localhost:3000/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || 'E-mail verificado com sucesso!');
          setIsError(false);
        } else {
          setMessage(data.message || 'Erro ao verificar e-mail. Tente novamente.');
          setIsError(true);
        }
      } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        setMessage('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]); // searchParams é uma dependência do useEffect

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verificação de E-mail</CardTitle>
          <CardDescription className="text-muted-foreground">
            {loading ? 'Por favor, aguarde enquanto verificamos seu e-mail.' : 'Status da verificação do seu e-mail.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className={`text-lg ${isError ? 'text-destructive' : 'text-primary'}`}>
            {message}
          </p>
          {!loading && !isError && (
            <Button className="mt-4" onClick={() => window.location.href = '/auth/login'}>
              Ir para o Login
            </Button>
          )}
          {!loading && isError && (
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Voltar para o Início
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;


import api from '@/lib/api';
import React, { createContext, useContext, useState, useEffect } from 'react';


// Define a interface para os dados do usuário
interface User {
    id: number,
    email: string,
    name: string,
    role: string,
}

// Define a interface para o contexto
interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

// Cria o contexto com um valor padrão
const UserContext = createContext<UserContextType | undefined>(undefined);

// Cria o componente Provedor
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me'); // Ajuste o endpoint se necessário
        setUser(response.data);
      } catch (error) {
        console.error("Falha ao buscar dados do usuário", error);
        setUser(null); // Garante que o usuário seja nulo em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Cria um hook customizado para facilitar o uso do contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

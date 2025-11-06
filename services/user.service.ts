import api from '@/lib/api';
import { User } from '@/lib/schemas';

// Usuarios conocidos del sistema (temporal hasta que el backend implemente GET /users)
const KNOWN_USERS: User[] = [
  { id: 1, username: 'admin2', email: 'admin2@example.com', role: 'ADMIN' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'USER' },
  { id: 3, username: 'newuser', email: 'newuser@example.com', role: 'USER' },
];

export const userService = {
  // Obtener todos los usuarios (solo para ADMIN)
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Endpoint no implementado, devolver usuarios conocidos
        console.warn('Endpoint /users no implementado. Usando lista de usuarios conocidos.');
        return KNOWN_USERS;
      }
      throw error;
    }
  },

  // Obtener un usuario por ID
  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

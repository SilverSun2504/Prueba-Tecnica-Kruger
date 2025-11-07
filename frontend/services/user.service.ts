import api from '@/lib/api';
import { User } from '@/lib/schemas';

const KNOWN_USERS: User[] = [
  { id: 1, username: 'admin2', email: 'admin2@example.com', role: 'ADMIN' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'USER' },
  { id: 3, username: 'newuser', email: 'newuser@example.com', role: 'USER' },
];

export const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        console.warn(`Endpoint /users error ${error.response?.status}. Usando lista de usuarios conocidos.`);
        return KNOWN_USERS;
      }
      console.warn('Error loading users from API, using fallback users:', error.message);
      return KNOWN_USERS;
    }
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

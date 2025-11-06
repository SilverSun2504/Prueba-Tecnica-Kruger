import api from '@/lib/api';
import { LoginSchema, RegisterSchema, User } from '@/lib/schemas';
import { z } from 'zod';

interface BackendLoginResponse {
  token: string;
  username: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  user: User;
}

type LoginFormInputs = z.infer<typeof LoginSchema>;
type RegisterFormInputs = z.infer<typeof RegisterSchema>;

export const authService = {
  login: async (credentials: LoginFormInputs): Promise<LoginResponse> => {
    const backendCredentials = {
      username: credentials.email,
      password: credentials.password,
    };

    try {
      const response = await api.post<BackendLoginResponse>('/auth/login', backendCredentials);
      
      const transformedResponse: LoginResponse = {
        token: response.data.token,
        user: {
          id: 1,
          username: response.data.username,
          email: credentials.email,
          role: response.data.role as 'ADMIN' | 'USER',
        }
      };
      
      return transformedResponse;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Full error:', error);
      throw error;
    }
  },

  register: async (data: RegisterFormInputs): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

import { projectId, publicAnonKey } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const API_BASE = `${supabaseUrl}/functions/v1/make-server-65112a46`;

interface SignupData {
  email: string;
  password: string;
  name: string;
  userType: 'buyer' | 'seller';
}

interface LoginData {
  email: string;
  password: string;
}

interface ProductData {
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
}

export const api = {
  // Auth
  async signup(data: SignupData) {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async login(data: LoginData) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async logout(accessToken: string) {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.json();
  },

  async getProfile(accessToken: string) {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.json();
  },

  // Products
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    return response.json();
  },

  async addProduct(data: ProductData, accessToken: string) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async getSellerProducts(accessToken: string) {
    const response = await fetch(`${API_BASE}/seller/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.json();
  },
};
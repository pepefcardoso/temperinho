'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const COOKIE_NAME = 'AUTH_TOKEN';

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Falha ao invalidar token no servidor.', error);
    }
  }

  cookieStore.delete(COOKIE_NAME);
}

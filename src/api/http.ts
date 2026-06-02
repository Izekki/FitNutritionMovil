import { API_URL } from './config';

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const rawBody = await response.text();
  const data = rawBody ? safeJsonParse(rawBody) : null;

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `Request failed with HTTP ${response.status}.`;
    throw new Error(message);
  }

  return data as T;
}

function safeJsonParse(rawBody: string) {
  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

export function unwrapList<T>(payload: T[] | { data?: T[]; items?: T[]; rows?: T[] }): T[] {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.items ?? payload.rows ?? [];
}

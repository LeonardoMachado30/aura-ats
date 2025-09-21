import api from '.';
import { unmask } from '../utils/mask/unmask';

export async function searchApi(
  input: string,
  typeColumns: 'persons' | 'companies',
  options = {}
): Promise<any> {
  if (!input || input.trim() === '') {
    throw new Error('Por favor, preencha o campo de busca.');
  }

  const inputUnmask = unmask(input);

  const URL =
    process.env.NEXT_PUBLIC_API_URL + '/api/externalWithAuth/take-it/search';

  const params = {
    query: inputUnmask,
    tipo: typeColumns,
    ...options,
  };

  try {
    const response = await api.get(URL, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}

import { ProvidersResponse } from '../types';

export const providersService = {
  async fetchProviders(): Promise<ProvidersResponse> {
    const response = await fetch('/proveedores.json');
    if (!response.ok) {
      throw new Error('Error al cargar el listado de proveedores');
    }
    return await response.json();
  }
};

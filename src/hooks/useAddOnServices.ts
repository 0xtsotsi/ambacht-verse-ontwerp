import { useState, useEffect } from 'react';
import { getAddOnServices, getAddOnServicesByCategory, type AddOnService } from '@/integrations/supabase/database';

export function useAddOnServices() {
  const [services, setServices] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAddOnServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching add-on services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category);
  };

  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  const calculateServicePrice = (service: AddOnService, guestCount: number, quantity: number = 1) => {
    if (service.price_per_person) {
      return service.price_per_person * guestCount * quantity;
    }
    return (service.flat_rate || 0) * quantity;
  };

  return {
    services,
    loading,
    error,
    getServicesByCategory,
    getServiceById,
    calculateServicePrice
  };
}
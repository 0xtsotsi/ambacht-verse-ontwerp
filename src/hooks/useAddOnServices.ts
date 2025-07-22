import { useState, useEffect } from "react";
import {
  getAddOnServices,
  getAddOnServicesByCategory,
  type AddOnService,
} from "@/integrations/supabase/database";
import { useApiLoggerQuery } from "./useApiLogger";
import { logApiError } from "@/lib/apiLogger";

export function useAddOnServices() {
  const [error, setError] = useState<string | null>(null);

  // Enhanced query with logging
  const servicesQuery = useApiLoggerQuery({
    queryKey: ["add-on-services"],
    queryFn: getAddOnServices,
    endpoint: "add_on_services",
    method: "GET",
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Handle errors
  useEffect(() => {
    if (servicesQuery.error) {
      logApiError("add_on_services", servicesQuery.error as Error, {
        method: "GET",
      });
      setError(servicesQuery.error.message);
    } else {
      setError(null);
    }
  }, [servicesQuery.error]);

  const getServicesByCategory = (category: string) => {
    return (
      servicesQuery.data?.filter((service) => service.category === category) ||
      []
    );
  };

  const getServiceById = (id: string) => {
    return servicesQuery.data?.find((service) => service.id === id);
  };

  const calculateServicePrice = (
    service: AddOnService,
    guestCount: number,
    quantity: number = 1,
  ) => {
    if (service.price_per_person) {
      return service.price_per_person * guestCount * quantity;
    }
    return (service.flat_rate || 0) * quantity;
  };

  return {
    services: servicesQuery.data || [],
    loading: servicesQuery.isLoading,
    error,
    getServicesByCategory,
    getServiceById,
    calculateServicePrice,
    refetch: servicesQuery.refetch,
  };
}

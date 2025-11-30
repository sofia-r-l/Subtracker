import { ref, computed } from 'vue';
import type { Subscription } from '@/types/Subscription';

// Estado global
const subscriptions = ref<Subscription[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Exchange rate comes from env (Vite) or defaults to 26 HNL / 1 USD
const EXCHANGE_RATE = Number((import.meta.env.VITE_EXCHANGE_RATE as string) || 26);

export const useSubscriptions = () => {
  // Cálculos computados
  const totalMonthlyExpense = computed(() => {
    return subscriptions.value.reduce((total, sub) => {
      let monthlyPrice = sub.price;
      
      // Convertir frecuencia anual a mensual
      if (sub.frequency === 'yearly') {
        monthlyPrice = sub.price / 12;
      }
      
      // Convertir a HNL si es necesario
      if (sub.currency === 'USD') {
        monthlyPrice *= EXCHANGE_RATE;
      }
      
      return total + monthlyPrice;
    }, 0);
  });

    // Use a backend API for CRUD (default to localhost)
    const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';

    const fetchSubscriptions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE}/subscriptions`);
      if (!res.ok) throw new Error(`Error fetching subscriptions: ${res.statusText}`);
      const data = await res.json();
      // Ensure date strings
      subscriptions.value = data.map((s: any) => ({
        ...s,
        payment_date: s.payment_date ? new Date(s.payment_date).toISOString().split('T')[0] : s.payment_date,
        created_at: s.created_at ? new Date(s.created_at).toISOString() : s.created_at,
      }));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading.value = false;
    }
  };

  const createSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at'>) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.statusText}`);
      const created = await res.json();
      subscriptions.value.unshift({
        ...created,
        payment_date: created.payment_date ? new Date(created.payment_date).toISOString().split('T')[0] : created.payment_date,
      });
      return created as Subscription;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSubscription = async (id: number, subscription: Partial<Subscription>) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.statusText}`);
      const updated = await res.json();
      const index = subscriptions.value.findIndex(sub => sub.id === id);
      if (index !== -1) {
        subscriptions.value[index] = { ...subscriptions.value[index], ...updated };
        return subscriptions.value[index];
      }
      // If not present locally, add it
      subscriptions.value.unshift(updated);
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSubscription = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE}/subscriptions/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error(`Delete failed: ${res.statusText}`);
      subscriptions.value = subscriptions.value.filter(sub => sub.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    subscriptions: computed(() => subscriptions.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    totalMonthlyExpense,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
};
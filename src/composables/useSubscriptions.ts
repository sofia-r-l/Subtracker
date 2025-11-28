import { ref, computed } from 'vue';
import type { Subscription } from '@/types/Subscription';

// Estado global
const subscriptions = ref<Subscription[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Tasa de cambio fija
const EXCHANGE_RATE = 26;

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

  // Para esta prueba, usaremos datos mock
  const fetchSubscriptions = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      subscriptions.value = [
        {
          id: 1,
          name: 'Netflix',
          price: 12.99,
          currency: 'USD',
          frequency: 'monthly',
          payment_date: '2024-01-15',
          created_at: '2024-01-01'
        },
        {
          id: 2,
          name: 'Gimnasio',
          price: 500,
          currency: 'HNL',
          frequency: 'monthly',
          payment_date: '2024-01-10',
          created_at: '2024-01-01'
        },
        {
          id: 3,
          name: 'Spotify Premium',
          price: 9.99,
          currency: 'USD',
          frequency: 'monthly',
          payment_date: '2024-01-20',
          created_at: '2024-01-01'
        }
      ];
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
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSubscription: Subscription = {
        id: Date.now(),
        ...subscription,
        created_at: new Date().toISOString()
      };
      
      subscriptions.value.unshift(newSubscription);
      return newSubscription;
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
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = subscriptions.value.findIndex(sub => sub.id === id);
      if (index !== -1) {
        subscriptions.value[index] = { ...subscriptions.value[index], ...subscription };
        return subscriptions.value[index];
      }
      throw new Error('Subscription not found');
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
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
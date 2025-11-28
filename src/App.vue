<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">SubTracker</h1>
        <p class="text-gray-600">Gestiona tus finanzas personales</p>
        
        <!-- Total Monthly Expense -->
        <div class="mt-6 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Gasto Total Mensual Estimado</h2>
          <p class="text-3xl font-bold text-green-600">
            {{ formatPrice(totalMonthlyExpense) }} HNL
          </p>
        </div>
      </header>

      <main class="max-w-6xl mx-auto">
        <!-- Subscription Form -->
        <section class="mb-8">
          <SubscriptionForm
            :subscription="editingSubscription"
            :is-editing="!!editingSubscription"
            @submit="handleFormSubmit"
            @cancel="cancelEdit"
          />
        </section>

        <!-- Subscription List -->
        <section>
          <SubscriptionList
            @edit="startEdit"
            @delete="handleDelete"
          />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSubscriptions } from '@/composables/useSubscriptions';
import SubscriptionForm from './components/SubscriptionForm.vue';
import SubscriptionList from './components/SubscriptionList.vue';
import type { Subscription } from '@/types/Subscription';

const {
  subscriptions,
  totalMonthlyExpense,
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = useSubscriptions();

const editingSubscription = ref<Subscription | null>(null);

onMounted(() => {
  fetchSubscriptions();
});

const handleFormSubmit = async (subscriptionData: Omit<Subscription, 'id' | 'created_at'>) => {
  try {
    if (editingSubscription.value) {
      await updateSubscription(editingSubscription.value.id!, subscriptionData);
      console.log('✅ Suscripción actualizada:', subscriptionData);
    } else {
      await createSubscription(subscriptionData);
      console.log('✅ Suscripción creada:', subscriptionData);
    }
    editingSubscription.value = null;
  } catch (error) {
    console.error('❌ Error saving subscription:', error);
    alert('Error al guardar la suscripción');
  }
};

const startEdit = (subscription: Subscription) => {
  editingSubscription.value = subscription;
  console.log('✏️ Editando suscripción:', subscription);
};

const cancelEdit = () => {
  editingSubscription.value = null;
  console.log('❌ Edición cancelada');
};

const handleDelete = async (id: number) => {
  try {
    await deleteSubscription(id);
    console.log('🗑️ Suscripción eliminada:', id);
  } catch (error) {
    console.error('❌ Error deleting subscription:', error);
    alert('Error al eliminar la suscripción');
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

console.log('web funcionando');
</script>
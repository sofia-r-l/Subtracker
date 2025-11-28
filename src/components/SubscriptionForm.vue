<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-md space-y-4">
    <h2 class="text-xl font-bold text-gray-800">
      {{ isEditing ? 'Editar Suscripción' : 'Nueva Suscripción' }}
    </h2>
    
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
        placeholder="Netflix, Gym, Spotify..."
      >
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">Precio</label>
        <input
          id="price"
          v-model.number="formData.price"
          type="number"
          step="0.01"
          min="0"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          placeholder="0.00"
        >
      </div>

      <div>
        <label for="currency" class="block text-sm font-medium text-gray-700">Moneda</label>
        <select
          id="currency"
          v-model="formData.currency"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
        >
          <option value="HNL">HNL</option>
          <option value="USD">USD</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="frequency" class="block text-sm font-medium text-gray-700">Frecuencia</label>
        <select
          id="frequency"
          v-model="formData.frequency"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
        >
          <option value="monthly">Mensual</option>
          <option value="yearly">Anual</option>
        </select>
      </div>

      <div>
        <label for="payment_date" class="block text-sm font-medium text-gray-700">Fecha de Pago</label>
        <input
          id="payment_date"
          v-model="formData.payment_date"
          type="date"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
        >
      </div>
    </div>

    <div class="flex gap-2 pt-4">
      <button
        type="submit"
        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {{ isEditing ? 'Actualizar' : 'Crear Suscripción' }}
      </button>
      <button
        v-if="isEditing"
        type="button"
        @click="cancelEdit"
        class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Subscription } from '@/types/Subscription';

interface Props {
  subscription?: Subscription;
  isEditing?: boolean;
}

interface Emits {
  (e: 'submit', subscription: Omit<Subscription, 'id' | 'created_at'>): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  subscription: undefined
});

const emit = defineEmits<Emits>();

// Inicializar con valores por defecto
const formData = ref({
  name: '',
  price: 0,
  currency: 'HNL' as const,
  frequency: 'monthly' as const,
  payment_date: new Date().toISOString().split('T')[0] // Fecha actual
});

// PRIMERO definir la función resetForm
const resetForm = () => {
  formData.value = {
    name: '',
    price: 0,
    currency: 'HNL',
    frequency: 'monthly',
    payment_date: new Date().toISOString().split('T')[0]
  };
};

// LUEGO el watch que usa resetForm
watch(() => props.subscription, (newSubscription) => {
  if (newSubscription) {
    formData.value = {
      name: newSubscription.name,
      price: newSubscription.price,
      currency: newSubscription.currency,
      frequency: newSubscription.frequency,
      payment_date: newSubscription.payment_date
    };
  } else {
    resetForm();
  }
}, { immediate: true });

const handleSubmit = () => {
  try {
    // Validación básica
    if (!formData.value.name.trim()) {
      alert('El nombre es requerido');
      return;
    }
    
    if (formData.value.price <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    if (!formData.value.payment_date) {
      alert('La fecha de pago es requerida');
      return;
    }

    console.log('📤 Enviando formulario:', formData.value);
    emit('submit', { ...formData.value });
    
    if (!props.isEditing) {
      resetForm();
    }
  } catch (error) {
    console.error('❌ Error en handleSubmit:', error);
  }
};

const cancelEdit = () => {
  resetForm();
  emit('cancel');
};

console.log('✅ SubscriptionForm cargado correctamente');
</script>
<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-semibold text-gray-800">{{ subscription.name }}</h3>
      <div class="flex gap-2">
        <button
          @click="$emit('edit', subscription)"
          class="text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
          title="Editar"
        >
          ✏️
        </button>
        <button
          @click="confirmDelete"
          class="text-red-600 hover:text-red-800 focus:outline-none transition-colors"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="space-y-2 text-sm text-gray-600">
      <div class="flex justify-between">
        <span>Precio:</span>
        <span class="font-medium">
          {{ formatPrice(subscription.price) }} {{ subscription.currency }}
        </span>
      </div>
      
      <div class="flex justify-between">
        <span>Frecuencia:</span>
        <span class="font-medium capitalize">
          {{ subscription.frequency === 'monthly' ? 'Mensual' : 'Anual' }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Próximo pago:</span>
        <span class="font-medium">
          {{ formatDate(subscription.payment_date) }}
        </span>
      </div>

      <div class="flex justify-between border-t pt-2 mt-2">
        <span>Mensual equivalente:</span>
        <span class="font-bold text-green-600">
          {{ formatPrice(monthlyEquivalent) }} HNL
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Subscription } from '@/types/Subscription';

interface Props {
  subscription: Subscription;
}

interface Emits {
  (e: 'edit', subscription: Subscription): void;
  (e: 'delete', id: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// read exchange rate from Vite env (fallback 26)
const EXCHANGE_RATE = Number((import.meta.env.VITE_EXCHANGE_RATE as string) || 26);

const monthlyEquivalent = computed(() => {
  let monthly = props.subscription.price;
  
  if (props.subscription.frequency === 'yearly') {
    monthly = props.subscription.price / 12;
  }
  
  if (props.subscription.currency === 'USD') {
    monthly *= EXCHANGE_RATE;
  }
  
  return monthly;
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN');
};

const confirmDelete = () => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${props.subscription.name}"?`)) {
    emit('delete', props.subscription.id!);
  }
};
</script>
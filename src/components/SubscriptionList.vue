<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Cargando suscripciones...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Error:</strong> {{ error }}
      <button @click="fetchSubscriptions" class="ml-4 text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
        Reintentar
      </button>
    </div>

    <div v-else-if="subscriptions.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
      <p class="text-gray-500 text-lg">No hay suscripciones registradas</p>
      <p class="text-gray-400 mt-2">Agrega tu primera suscripción usando el formulario de arriba</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SubscriptionCard
        v-for="subscription in subscriptions"
        :key="subscription.id"
        :subscription="subscription"
        @edit="$emit('edit', subscription)"
        @delete="$emit('delete', subscription.id!)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSubscriptions } from '@/composables/useSubscriptions';
import SubscriptionCard from './SubscriptionCard.vue';  // ¡Esta línea es importante!
import type { Subscription } from '@/types/Subscription';

interface Emits {
  (e: 'edit', subscription: Subscription): void;
  (e: 'delete', id: number): void;
}

const { subscriptions, loading, error, fetchSubscriptions } = useSubscriptions();
defineEmits<Emits>();
</script>
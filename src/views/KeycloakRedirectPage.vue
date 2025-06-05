<template>
  <div>We prepare your session...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(async () => {
    const nextRouteCache = localStorage.getItem('next-route-cache')
    if (nextRouteCache) {
      localStorage.removeItem('next-route-cache')
      await router.push(nextRouteCache);
    }  else {
      await router.push("/");
    }
  }, 5000)
})
</script>

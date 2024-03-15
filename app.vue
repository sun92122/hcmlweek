<template>
  <div id="app">
    <NuxtLoadingIndicator />
    <NuxtLayout />

    <UNotifications />
  </div>
</template>


<script setup lang="ts">
useHead({
  title: "竹苗文化週",
  meta: [
    {
      name: "description",
      content: "2024 師大竹苗文化週",
    },
  ],
});
</script>

<style>
#app {
  font-family: "Noto Sans TC", "Noto Serif TC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  min-height: 100vh;
  background-color: #e3a6e133;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.underline {
  text-decoration: underline;
}
</style>

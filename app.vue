<template>
  <div id="app">
    <!-- use Cookie Notification -->
    <UNotification
      v-show="showNotification"
      class="text-left"
      id="cookie"
      title="Cookie"
      description="購物車會儲存在瀏覽器 Cookie 中，您也可以放點 Cookie 進購物車。"
      :timeout="0"
      :actions="[
        {
          label: '我知道了',
          onClick: () => {
            showNotification = false;
            store.showNotification = false;
          },
        },
        {
          label: '了解更多',
          to: 'https://www.cloudflare.com/zh-tw/learning/privacy/what-are-cookies/',
          target: '_blank',
        },
      ]"
      :close-button="{ icon: null }"
    >
    </UNotification>

    <NuxtLoadingIndicator />
    <NuxtLayout />

    <UNotifications>
      <template #title="{ title }">
        <span v-html="title"></span>
      </template>
      <template #description="{ description }">
        <span v-html="description"></span>
      </template>
    </UNotifications>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "./store";

useHead({
  title: "竹苗文化週",
  meta: [
    {
      name: "description",
      content: "2024 師大竹苗文化週",
    },
  ],
});

const showNotification = ref(true);
const store = useStore();
if (!store.showNotification) {
  showNotification.value = false;
}
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

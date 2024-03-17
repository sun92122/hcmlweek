<template>
  <div class="wrapper">
    <!-- nav bar -->
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-gray-900"
    >
      <template #icon="{ link }">
        <UIcon :name="link.icon" :dynamic="link.icon === 'i-bi-instagram'" />
      </template>
    </UHorizontalNavigation>

    <!-- announcement -->
    <UModal v-model="showAnnouncement" :ui="{ container: 'items-center' }">
      <UCard>
        <template #header>
          <div class="h-4">竹夢踏實 苗繪宇宙</div>
        </template>

        <div class="h-32 flex flex-col">
          <span class="pb-1"> 預購週時間：3/18-3/22 </span>
          <span class="pb-1"> 正式週時間：3/25-4/12 </span>
          <span class="pb-1">
            於預購週下單滿60元即擁有抽獎資格！！獎品包括燈籠滷味、茶壜折價券等等！！
          </span>
        </div>
      </UCard>
    </UModal>

    <!-- shop -->
    <div class="page-container">
      <NuxtPage />
    </div>

    <!-- footer -->
    <footer class="bg-light py-2 text-center mt-3">
      <p>&copy; 2024 NTNU HCML WEEK</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store";

export default {
  name: "DefaultLayout",
  data() {
    const colorMode = useColorMode();
    const isDark = colorMode.value === "dark";
    return {
      isDark,
      loading: true,
    };
  },
  computed: {
    links() {
      const store = useStore();
      const cartCount = store.getCartCount;
      return [
        [
          {
            label: "Shop",
            icon: "i-heroicons-shopping-bag",
            to: "/",
          },
          {
            label: "Help",
            icon: "i-heroicons-question-mark-circle",
            to: "/help",
          },
          {
            label: "IG",
            icon: "i-bi-instagram",
            // to: "https://www.instagram.com/hcmlweek" new tab
            click: () => {
              window.open("https://www.instagram.com/hcmlweek", "_blank");
            },
          },
        ],
        [
          {
            label: "",
            icon: this.isDark ? "i-heroicons-moon" : "i-heroicons-sun",
            click: () => {
              const colorMode = useColorMode();
              colorMode.preference =
                colorMode.value === "dark" ? "light" : "dark";
            },
          },
          {
            label: "Cart",
            icon: "i-heroicons-shopping-cart",
            to: "/cart",
            badge: (cartCount > 0 && cartCount) || undefined,
          },
        ],
      ];
    },
  },
};
</script>

<script setup lang="ts">
const showAnnouncement = ref(true);
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-container {
  min-height: calc(100vh - 100px);
  width: 100%;
}
</style>

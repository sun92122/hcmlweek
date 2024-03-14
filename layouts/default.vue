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

    <!-- cart icon -->

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

<script setup lang="ts"></script>

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

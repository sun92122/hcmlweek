<template>
  <div class="wrapper">
    <!-- nav bar -->
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800"
    />

    <!-- cart icon -->

    <!-- shop -->
    <div class="page-container">
      <NuxtPage />
    </div>

    <!-- footer -->
    <footer class="bg-light py-2 text-center">
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
            label: "Home",
            icon: "i-heroicons-home",
            to: "/",
          },
          {
            label: "Help",
            icon: "i-heroicons-question-mark-circle",
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

<template>
  <div class="wrapper">
    <!-- nav bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="store-name" href="/">Store</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNavAltMarkup" class="collapse navbar-collapse">
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="/">Home</a>
          <a class="nav-item nav-link" href="/about">About</a>
          <a class="nav-item nav-link" href="/contact">Contact</a>
        </div>
      </div>
    </nav>

    <!-- cart icon -->

    <!-- shop -->
    <NuxtPage />

    <!-- footer -->
    <footer class="bg-light py-2 text-center">
      <p>&copy; 2024 NTNU HCML WEEK</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store";
export default {
  setup() {
    const store = useStore();
    store.getProductsFromAPI();
  },
};
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

// main.ts
import { createApp } from "vue";
import "./styles/mug.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { useBeverageStore } from "./stores/beverageStore";

console.log('Vue app initialization starting...');

// Create pinia with persistence plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

// Create the app and use pinia
const app = createApp(App);
app.use(pinia);

// Initialize app with proper sequence
async function initApp() {
  try {
    console.log('Starting application initialization sequence...');
    
    // Mount the app first
    app.mount('#app');
    
    // Then initialize the store to load data from Firebase
    console.log('Initializing beverage store...');
    const beverageStore = useBeverageStore();
    const success = await beverageStore.init();
    
    if (success) {
      console.log('Application fully initialized!');
    } else {
      console.warn('Application initialized with errors');
    }
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // App is already mounted, so user will see error UI
  }
}

// Run the initialization
initApp().catch(error => {
  console.error('Unhandled error during app initialization:', error);
});
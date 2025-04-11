<template>
  <div class="app-container">
    <div v-if="beverageStore.isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading beverage data...</p>
    </div>
    
    <div v-else-if="beverageStore.error" class="error-overlay">
      <p>Error loading data: {{ beverageStore.error }}</p>
      <button @click="retryInitialization">Retry</button>
    </div>
    
    <template v-else>
      <Beverage :isIced="beverageStore.currentTemp.name === 'Cold'" />
      
      <div class="controls-container">
        <!-- Temperature Controls -->
        <div class="control-group">
          <h3>Temperature</h3>
          <ul>
            <li v-for="temp in beverageStore.temps" :key="temp.id">
              <label>
                <input
                  type="radio"
                  name="temperature"
                  :id="`r${temp.id}`"
                  :value="temp"
                  :checked="beverageStore.currentTemp.id === temp.id"
                  @change="beverageStore.setTemperature(temp)"
                />
                {{ temp.name }}
              </label>
            </li>
          </ul>
        </div>
        
        <!-- Base Controls -->
        <div class="control-group">
          <h3>Base</h3>
          <ul>
            <li v-for="base in beverageStore.bases" :key="base.id">
              <label>
                <input
                  type="radio"
                  name="base"
                  :id="`b${base.id}`"
                  :value="base"
                  :checked="beverageStore.currentBase?.id === base.id"
                  @change="beverageStore.setBase(base)"
                />
                {{ base.name }}
              </label>
            </li>
          </ul>
        </div>
        
        <!-- Creamer Controls -->
        <div class="control-group">
          <h3>Creamer</h3>
          <ul>
            <li v-for="creamer in beverageStore.creamers" :key="creamer.id">
              <label>
                <input
                  type="radio"
                  name="creamer"
                  :id="`c${creamer.id}`"
                  :value="creamer"
                  :checked="beverageStore.currentCreamer?.id === creamer.id"
                  @change="beverageStore.setCreamer(creamer)"
                />
                {{ creamer.name }}
              </label>
            </li>
          </ul>
        </div>
        
        <!-- Syrup Controls -->
        <div class="control-group">
          <h3>Syrup</h3>
          <ul>
            <li v-for="syrup in beverageStore.syrups" :key="syrup.id">
              <label>
                <input
                  type="radio"
                  name="syrup"
                  :id="`s${syrup.id}`"
                  :value="syrup"
                  :checked="beverageStore.currentSyrup?.id === syrup.id"
                  @change="beverageStore.setSyrup(syrup)"
                />
                {{ syrup.name }}
              </label>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Save Beverage Controls -->
      <div class="save-controls-container">
        <input 
          type="text" 
          placeholder="Beverage Name" 
          v-model="beverageStore.beverageName"
        />
        <button @click="beverageStore.makeBeverage()">🍺 Make Beverage</button>
      </div>
    
      <!-- Saved beverages container -->
      <div id="beverage-container" class="saved-beverages">
        <h3 v-if="beverageStore.savedBeverages.length > 0">Saved Beverages</h3>
        <div class="beverage-list">
          <button 
            v-for="beverage in beverageStore.savedBeverages" 
            :key="beverage.id"
            :class="{ active: beverageStore.selectedBeverageId === beverage.id }"
            @click="beverageStore.showBeverage(beverage.id)"
          >
            {{ beverage.name }}
          </button>
        </div>
        
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";


const beverageStore = useBeverageStore();

// Helper function to retry initialization if it fails
async function retryInitialization() {
  await beverageStore.init();
}


</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

.controls-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  white-space: nowrap;
  overflow-x: auto; /* Allow horizontal scrolling if needed */
  margin-bottom: 20px;
}

.control-group {
  margin-right: 20px;
  
  &:last-child {
    margin-right: 0;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #fff;
    padding-bottom: 5px;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 8px;
    
    label {
      display: flex;
      align-items: center;
      color: #fff;
      cursor: pointer;
      
      input {
        margin-right: 8px;
      }
    }
  }
}

.save-controls-container {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  align-items: center;
}

input[type="text"] {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  min-width: 200px;
  font-size: 16px;
}

button {
  padding: 8px 15px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &.active {
    background-color: #e09e5f;
    color: white;
  }
}

.saved-beverages {
  width: 100%;
  color: #fff;
  text-align: center;
  
  h3 {
    margin-bottom: 15px;
  }
}

.beverage-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  
  button {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }
    
    &.active {
      background-color: #e09e5f;
    }
  }
}

@media (max-width: 500px) {
  .controls-container {
    flex-direction: column;
  }
  
  .control-group {
    margin-right: 0;
    margin-bottom: 15px;
  }
}

.loading-overlay, .error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-overlay button {
  margin-top: 15px;
  background-color: #e09e5f;
  color: white;
}

.clear-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.clear-btn {
  background-color: #ff9800;
  color: white;
}

.clear-all-btn {
  background-color: #f44336;
  color: white;
}
</style>
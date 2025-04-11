// beverageStore.ts
import { defineStore } from "pinia";
import temperatures from "../data/tempretures.json";
import db from "../firebase";
import { collection, getDocs, doc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Type definitions
interface Base {
  id: string;
  name: string;
  color: string;
}

interface Creamer {
  id: string;
  name: string;
  color: string;
}

interface Syrup {
  id: string;
  name: string;
  color: string;
}

interface Temperature {
  id: number;
  name: string;
  value: string;
}

interface Beverage {
  id: string;
  name: string;
  base: Base;
  creamer: Creamer;
  syrup: Syrup;
  temperature: Temperature;
  createdAt: number;
}

const formattedTemps = temperatures.map((name, index) => ({
  id: index + 1,
  name,
  value: name.toLowerCase()
})) as Temperature[];

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: formattedTemps,
    currentTemp: formattedTemps[0],
    bases: [] as Base[],
    currentBase: null as Base | null,
    creamers: [] as Creamer[],
    currentCreamer: null as Creamer | null,
    syrups: [] as Syrup[],
    currentSyrup: null as Syrup | null,
    beverageName: "",
    savedBeverages: [] as Beverage[],
    selectedBeverageId: null as string | null,
    isLoading: false,
    error: null as string | null,
    isInitialized: false
  }),

  actions: {
    // Initialize store by loading data from Firestore
    async init() {
      if (this.isInitialized) {
        console.log("Store already initialized, skipping");
        return true;
      }

      this.isLoading = true;
      this.error = null;

      try {

        console.log("Initializing beverage store...");

        // Fetch bases
        const basesSnapshot = await getDocs(collection(db, "bases"));
        this.bases = basesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Base[];
        console.log(`Loaded ${this.bases.length} bases`);

        // Fetch creamers
        const creamersSnapshot = await getDocs(collection(db, "creamers"));
        this.creamers = creamersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Creamer[];
        console.log(`Loaded ${this.creamers.length} creamers`);

        // Fetch syrups
        const syrupsSnapshot = await getDocs(collection(db, "syrups"));
        this.syrups = syrupsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Syrup[];
        console.log(`Loaded ${this.syrups.length} syrups`);

        // Set default values if collections are not empty
        if (this.bases.length > 0) {
          this.currentBase = this.bases[0];
        }
        if (this.creamers.length > 0) {
          this.currentCreamer = this.creamers[0];
        }
        if (this.syrups.length > 0) {
          this.currentSyrup = this.syrups[0];
        }

        // Set up listener for saved beverages
        this.setupBeverageListener();
        
        this.isInitialized = true;
        console.log("Beverage store initialized successfully");
        return true;
      } catch (e: any) {
        console.error("Error initializing beverage store:", e);
        this.error = e.message;
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Set up real-time listener for beverages collection
    setupBeverageListener() {
      const beveragesQuery = query(
        collection(db, "beverages"), 
        orderBy("createdAt", "desc")
      );
      
      onSnapshot(beveragesQuery, (snapshot) => {
        this.savedBeverages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Beverage[];
        console.log(`Loaded ${this.savedBeverages.length} beverages`);
      }, (error) => {
        console.error("Error listening to beverages:", error);
        this.error = error.message;
      });
    },

    // Create a new beverage and save it to Firestore
    async makeBeverage() {
      if (!this.beverageName.trim()) {
        alert("Please enter a name for your beverage");
        return;
      }

      if (!this.currentBase || !this.currentCreamer || !this.currentSyrup) {
        alert("Please ensure all beverage components are selected");
        return;
      }

      try {
        const newBeverage: Beverage = {
          id: crypto.randomUUID(), // Generate UUID for the document ID
          name: this.beverageName,
          base: this.currentBase,
          creamer: this.currentCreamer,
          syrup: this.currentSyrup,
          temperature: this.currentTemp,
          createdAt: Date.now()
        };

        // Add the beverage to Firestore
        await setDoc(doc(db, "beverages", newBeverage.id), newBeverage);
        console.log(`Beverage "${newBeverage.name}" saved to Firestore`);
        
        // Reset name input
        this.beverageName = "";
      } catch (e: any) {
        console.error("Error saving beverage:", e);
        this.error = e.message;
        alert(`Failed to save beverage: ${e.message}`);
      }
    },

    // Show a selected beverage
    showBeverage(beverageId: string) {
      const beverage = this.savedBeverages.find((b) => b.id === beverageId);
      if (beverage) {
        this.selectedBeverageId = beverageId;
        this.currentBase = beverage.base;
        this.currentCreamer = beverage.creamer;
        this.currentSyrup = beverage.syrup;
        this.currentTemp = beverage.temperature;
      }
    },

    // Additional helper methods
    setBase(base: Base) {
      this.currentBase = base;
    },

    setCreamer(creamer: Creamer) {
      this.currentCreamer = creamer;
    },

    setSyrup(syrup: Syrup) {
      this.currentSyrup = syrup;
    },

    setTemperature(temp: Temperature) {
      this.currentTemp = temp;
    },

    clearLocalBeverages() {
      this.savedBeverages = [];
      this.selectedBeverageId = null;
    },

    // Reset store to initial state
    reset() {
      // Reset only state, not collections data
      this.currentBase = this.bases.length > 0 ? this.bases[0] : null;
      this.currentCreamer = this.creamers.length > 0 ? this.creamers[0] : null;
      this.currentSyrup = this.syrups.length > 0 ? this.syrups[0] : null;
      this.currentTemp = this.temps[0];
      this.beverageName = "";
      this.selectedBeverageId = null;
    }
  }
});
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mostCommonCity } from "../utils/geofence";

// Each saved zone gets the next color in this palette (round-robin).
const ZONE_COLORS = [
  "#4f46e5",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#0ea5e9",
  "#ec4899",
];

export const useSiteStore = create()(
  persist(
    (set) => ({
      sites: [],
      dayPlans: [],
      selectedCity: null,
      geofencedSites: [],
      currentPlanId: null,
      savedGeofences: [],
      pendingZoneLoad: null,

      setSites: (sites) => set({ sites }),

      clearSites: () =>
        set({
          sites: [],
          selectedCity: null,
          geofencedSites: [],
          currentPlanId: null,
        }),

      addDayPlan: (plan) =>
        set((state) => ({ dayPlans: [...state.dayPlans, plan] })),

      updateSiteStatus: (siteId, status) =>
        set((state) => {
          const applyToSites = (list) =>
            list.map((s) => (s.id === siteId ? { ...s, status } : s));
          return {
            sites: applyToSites(state.sites),
            dayPlans: state.dayPlans.map((plan) => ({
              ...plan,
              sites: applyToSites(plan.sites),
              route: applyToSites(plan.route),
            })),
          };
        }),

      setSelectedCity: (city) => set({ selectedCity: city }),

      setGeofencedSites: (sites) => set({ geofencedSites: sites }),

      setCurrentPlanId: (id) => set({ currentPlanId: id }),

      saveGeofence: (name, polygon, sites) =>
        set((state) => {
          const coordinates = polygon
            .getPath()
            .getArray()
            .map((p) => ({ lat: p.lat(), lng: p.lng() }));
          const zone = {
            id: crypto.randomBytes(16).toString('hex'),
            name,
            city: mostCommonCity(sites),
            siteCount: sites.length,
            coordinates,
            color: ZONE_COLORS[state.savedGeofences.length % ZONE_COLORS.length],
            createdAt: new Date().toISOString(),
          };
          return { savedGeofences: [...state.savedGeofences, zone] };
        }),

      deleteGeofence: (id) =>
        set((state) => ({
          savedGeofences: state.savedGeofences.filter((z) => z.id !== id),
        })),

      renameGeofence: (id, newName) =>
        set((state) => ({
          savedGeofences: state.savedGeofences.map((z) =>
            z.id === id ? { ...z, name: newName } : z,
          ),
        })),

      // Hands a zone to SiteMap, which subscribes and redraws it on the map.
      loadSavedZone: (zone) => set({ pendingZoneLoad: zone }),

      clearPendingZoneLoad: () => set({ pendingZoneLoad: null }),
    }),
    {
      name: "pms-site-planner",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dayPlans: state.dayPlans,
        savedGeofences: state.savedGeofences,
      }),
    },
  ),
);

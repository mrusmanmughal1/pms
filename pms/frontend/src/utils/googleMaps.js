// A single useJsApiLoader configuration for the whole app.
//
// @react-google-maps/api throws "Loader must not be called again with
// different options" when two components load it with different `libraries`
// or `id`. LocationPicker needs `places` and the Site Planner needs
// `geometry`, so both import this shared object.
//
// `drawing` is deliberately absent: the DrawingManager was removed from the
// Maps JS API in v3.65, so SiteMap draws zones with plain map clicks.
//
// The array is defined once at module scope on purpose: passing a fresh
// array on every render makes the loader reload and triggers an infinite
// re-render loop.
export const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

export const GOOGLE_MAPS_LOADER = {
  id: "pms-google-maps",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  libraries: GOOGLE_MAPS_LIBRARIES,
};

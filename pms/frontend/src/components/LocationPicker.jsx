import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "0.4rem",
  marginTop: "1rem",
};

const libraries = ["places"];

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  // Default center (Riyadh, Saudi Arabia based on typical Project coords in the codebase)
  const defaultCenter = { lat: 24.7136, lng: 46.6753 };

  const center =
    latitude && longitude
      ? { lat: Number(latitude), lng: Number(longitude) }
      : defaultCenter;

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  const fetchAddressDetails = (lat, lng) => {
    if (!window.google || !window.google.maps) {
      onLocationChange({ latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let city = "";
      let region = "";
      if (status === "OK" && results[0]) {
        for (let component of results[0].address_components) {
          const types = component.types;
          if (types.includes("locality") || types.includes("administrative_area_level_2")) {
            if (!city) city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            region = component.long_name;
          }
        }
      }
      onLocationChange({
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
        city,
        region,
      });
    });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    fetchAddressDetails(lat, lng);
  };

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        let city = "";
        let region = "";
        if (place.address_components) {
          for (let component of place.address_components) {
            const types = component.types;
            if (types.includes("locality") || types.includes("administrative_area_level_2")) {
              if (!city) city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              region = component.long_name;
            }
          }
        }

        onLocationChange({
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
          city,
          region,
        });
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    }
  };

  if (loadError) {
    return (
      <div style={{ color: "red", marginTop: "1rem" }}>
        Error loading Google Maps. Make sure your API key is correct.
      </div>
    );
  }

  if (!isLoaded) {
    return <div style={{ marginTop: "1rem" }}>Loading Map...</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", marginTop: "1rem" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={latitude && longitude ? 15 : 10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {/* <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a location..."
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `80%`,
              height: `40px`,
              padding: `0 12px`,
              borderRadius: `0.4rem`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              maxWidth: "400px",
            }}
          />
        </Autocomplete> */}

        {latitude && longitude && (
          <Marker
            position={{ lat: Number(latitude), lng: Number(longitude) }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

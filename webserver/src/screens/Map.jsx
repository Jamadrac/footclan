import React, { useEffect } from "react";

const Map = () => {
  useEffect(() => {
    // Dynamically load Leaflet CSS
    const leafletCss = document.createElement("link");
    leafletCss.rel = "stylesheet";
    leafletCss.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
    document.head.appendChild(leafletCss);

    // Dynamically load Leaflet JS
    const leafletJs = document.createElement("script");
    leafletJs.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
    leafletJs.onload = () => {
      // Initialize the map once the script is loaded
      const map = L.map("map").setView([51.505, -0.09], 13);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Define the two locations
      const locations = [
        { lat: 51.505, lng: -0.09, title: "Location 1" },
        { lat: 51.515, lng: -0.1, title: "Location 2" },
      ];

      // Add markers for each location
      locations.forEach((location) => {
        L.marker([location.lat, location.lng])
          .addTo(map)
          .bindPopup(location.title)
          .openPopup();
      });
    };
    document.body.appendChild(leafletJs);

    return () => {
      // Cleanup added elements
      if (leafletCss.parentNode) {
        leafletCss.parentNode.removeChild(leafletCss);
      }
      if (leafletJs.parentNode) {
        leafletJs.parentNode.removeChild(leafletJs);
      }
    };
  }, []);

  return <div id="map" style={{ height: "500px" }}></div>;
};

export default Map;

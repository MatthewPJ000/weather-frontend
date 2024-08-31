import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import inside from '@turf/inside';

function MapComponent() {
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [pointsInRect, setPointsInRect] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoib2FrdHJlZWFuYWx5dGljcyIsImEiOiJjbGhvdWFzOHQxemYwM2ZzNmQxOW1xZXdtIn0.JPcZgPfkVUutq8t8Z_BaHg';
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.4194, 37.7749],
      zoom: 12,
    });

    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    mapInstance.addControl(drawInstance, 'top-left');

    setMap(mapInstance);
    setDraw(drawInstance);

    // Load your GeoJSON data here
    fetch('layers/USA&Canada.json')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data)
        mapInstance.addSource("testlayer", {
          type: "geojson",
          data: data,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 30
        });
        // Add a symbol layer

        mapInstance.addLayer({
          id: "testlayer",
          type: "circle",
          source: "testlayer",
          filter: ['has', 'point_count'],

          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          },
          layout: {
            visibility: "visible",
          },
        });

        mapInstance.addLayer({
          id: 'cluster-count' + "testlayer",
          type: 'symbol',
          source: "testlayer",
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
        mapInstance.addLayer({
          id: 'unclustered' + "testlayer",
          type: 'circle',
          source: "testlayer",
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
      });

      mapInstance.on('draw.update', handleGetPointsInRect);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const handleGetPointsInRect = () => {
    if (map && draw && geoJsonData) {
      const features = draw.getAll().features;
      if (features.length > 0) {
        const rectCoords = features[0].geometry.coordinates[0];
        const pointsInRect = geoJsonData.features.filter((feature) =>
          inside(feature, {
            type: 'Polygon',
            coordinates: [rectCoords],
          })
        );
        setPointsInRect(pointsInRect);
      }
    }
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
      <button onClick={handleGetPointsInRect}>Get Points in Rectangle</button>
      {pointsInRect.length > 0 && (
        <div>
          <h2>Points in Rectangle:</h2>
          <ul>
            {pointsInRect.map((point, index) => (
              <li key={index}>
                Latitude: {point.geometry.coordinates[1]}, Longitude: {point.geometry.coordinates[0]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapComponent;
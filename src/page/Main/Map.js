import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { LngLat } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import inside from '@turf/inside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLayerGroup, faTools, faGear, faBusSimple, faChartLine, faUser, faTowerBroadcast } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import './Map.css';
import Cookies from "js-cookie"
import assets from '../../assets';
import Window from '../../components/window';
import MapStyleSelection from '../../components/selection';
import PDLTabs from '../../components/pdlTab';
import Dashboard from '../../components/dashboard';
import DataManager from '../../components/dataManagement';
import SearchPanel from '../../components/search';
import { Popup } from "mapbox-gl";
import AgentPanel from '../../components/agent';
import store from '../../Redux/store';
import VenntelPanel from '../../components/venntelPanel';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { saveQueryDataVariable } from '../../Redux/actions/queryAction';
import { saveVenntelGeoPointsVariable } from '../../Redux/actions/venntel';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { getAuth, signOut } from "firebase/auth";

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2FrdHJlZWFuYWx5dGljcyIsImEiOiJjbGhvdWFzOHQxemYwM2ZzNmQxOW1xZXdtIn0.JPcZgPfkVUutq8t8Z_BaHg';

const MapComponent = () => {

  //----------Firebase--------\\
  const auth = getAuth();

  function logout(auth) {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  // ---------- Redux -----------\\
  const dispatch = useDispatch()
  const currentJson = useSelector((state) => state.myState.currentLayerDataVariable)

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const isInitialMount = useRef(true);
  const [draw, setDraw] = useState(null);
  const [pointsInRect, setPointsInRect] = useState([]);
  const popUp = new Popup({ closeButton: false, anchor: "left" });

  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [isDataManagementVisible, setIsDataManagementVisible] = useState(false);
  const [isQueryVisible, setIsQueryVisible] = useState(false);
  const [isToolVisible, setIsToolVisible] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [isVenntelVisible, setIsVenntelVisible] = useState(false);
  const [isAgentVisible, setIsAgentVisible] = useState(false);

  const [selectedLayerListItemText, setSelectedLayerListItemText] = React.useState(null);

  const [mGeoJson, setGeoJson] = useState();
  const [geoLength, setGeoLength] = useState(null)
  const [preSource, setPreSource] = useState(null)

  const [loading, setLoading] = useState(false);

  const handleListLayerItemSelected = (text) => {

    setSelectedLayerListItemText(text);
    // Do something with the selected list item text
  };

  const setWorkLayer = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (currentJson != null) {
      setGeoJson(currentJson)
      setGeoLength(currentJson.features.length)
      putGeoJson2Map(currentJson)
    }
  }, [currentJson])
  // useEffect(() => {
  //   if (mGeoJson) {
  //     putGeoJson2Map(mGeoJson)
  //   }
  // }, [mGeoJson])

  const putGeoJson2Map = (geodata) => {

    if (preSource != null) {
      mapRef.current?.removeLayer(preSource)
      mapRef.current?.removeLayer('unclustered' + preSource)
      mapRef.current?.removeLayer('cluster-count' + preSource)
      mapRef.current?.removeSource(preSource)
    }

    mapRef.current?.flyTo({
      center: geodata.features[0].geometry.coordinates,
      zoom: 5,
    });
    mapRef.current?.addSource(selectedLayerListItemText, {
      type: "geojson",
      data: geodata,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 30
    });
    // Add a symbol layer

    mapRef.current?.addLayer({
      id: selectedLayerListItemText,
      type: "circle",
      source: selectedLayerListItemText,
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

    mapRef.current?.addLayer({
      id: 'cluster-count' + selectedLayerListItemText,
      type: 'symbol',
      source: selectedLayerListItemText,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });
    mapRef.current?.addLayer({
      id: 'unclustered' + selectedLayerListItemText,
      type: 'circle',
      source: selectedLayerListItemText,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
    mapRef.current?.on('click', selectedLayerListItemText, (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: [selectedLayerListItemText]
      });
      const clusterId = features?.[0].properties?.cluster_id;
      const source = mapRef.current?.getSource(selectedLayerListItemText)

      source.getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;
          if (features?.[0].geometry.type === 'Point') {
            mapRef.current?.easeTo({
              center: [features?.[0].geometry.coordinates[0], features?.[0].geometry.coordinates[1]],
              zoom: zoom
            });
          }

        }
      );
    });

    mapRef.current?.on("style.load", () => {



      mapRef.current?.flyTo({
        center: geodata.features[0].geometry.coordinates,
        zoom: 5,
      });
      mapRef.current?.addSource(selectedLayerListItemText, {
        type: "geojson",
        data: geodata,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 30
      });
      // Add a symbol layer

      mapRef.current?.addLayer({
        id: selectedLayerListItemText,
        type: "circle",
        source: selectedLayerListItemText,
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

      mapRef.current?.addLayer({
        id: 'cluster-count' + selectedLayerListItemText,
        type: 'symbol',
        source: selectedLayerListItemText,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });
      mapRef.current?.addLayer({
        id: 'unclustered' + selectedLayerListItemText,
        type: 'circle',
        source: selectedLayerListItemText,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
      mapRef.current?.on('click', selectedLayerListItemText, (e) => {
        const features = mapRef.current?.queryRenderedFeatures(e.point, {
          layers: [selectedLayerListItemText]
        });
        const clusterId = features?.[0].properties?.cluster_id;
        const source = mapRef.current?.getSource(selectedLayerListItemText)

        source.getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            if (features?.[0].geometry.type === 'Point') {
              mapRef.current?.easeTo({
                center: [features?.[0].geometry.coordinates[0], features?.[0].geometry.coordinates[1]],
                zoom: zoom
              });
            }
          }
        );
      });
    })

    mapRef.current?.on("click", 'unclustered' + selectedLayerListItemText, (e) => {
      if (mapRef.current)
        mapRef.current.getCanvas().style.cursor = "pointer";


      const elementsToRemove = document.querySelectorAll(".mapboxgl-popup");

      elementsToRemove.forEach((element) => {
        element.remove();
      });
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const values = e.features[0].properties;
      const cheader = Object.keys(values);
      let html = "";
      // const values = i.properties;

      html += `<div class = "popup">`;
      const obj = cheader.reduce((object, header, index) => {
        html += `<div style="width:100%; display:flex">
                           <label for="name" style="width:40%; text-align:right; padding-right: 5px; align-self : center" >${header} :</label>
                           <div type="text"  style="width:60%; border: 0.01em solid white; padding : 3px">${values[header]}</div>
                       </div>
                       `;
        object[header] = values[header];
        return object;
      }, {});
      html += `<div style="width:100%; display:flex">
                           <label for="name" style="width:40%; text-align:right; padding-right: 5px; align-self : center" >Latitude :</label>
                           <div type="text"  style="width:60%; border: 0.01em solid white; padding : 3px">${coordinates[1]}</div>
                       </div>`;
      html += `<div style="width:100%; display:flex">
                       <label for="name" style="width:40%; text-align:right; padding-right: 5px; align-self : center" >Longtitude :</label>
                       <div type="text"  style="width:60%; border: 0.01em solid white; padding : 3px">${coordinates[0]}</div>
                   </div>`;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popUp.setLngLat(coordinates).setHTML(html).addTo(mapRef.current);

    });

    setPreSource(selectedLayerListItemText)
  }

  const [mapTileStyle, setMapTileStyle] = useState('mapbox://styles/mapbox/satellite-streets-v12');

  const handleTileStyleChange = (newTileStyle) => {
    setMapTileStyle(newTileStyle);
    console.log('Tile Style:', newTileStyle);
  };
  const handleGetPointsInRect = () => {
    if (mapRef.current && draw && mGeoJson) {
      console.log(mGeoJson)
      const features = draw.getAll().features;
      if (features.length > 0) {
        const rectCoords = features[0].geometry.coordinates[0];
        console.log(rectCoords)
        const pointsInRect = mGeoJson.features.filter((feature) =>
          inside(feature, {
            type: 'Polygon',
            coordinates: [rectCoords],
          })
        );

        setPointsInRect(pointsInRect);
        dispatch(saveQueryDataVariable(pointsInRect))
      }
    }
  };

  const handleVenntelGeoPoints = () => {
    if (mapRef.current && draw) {
      const features = draw.getAll().features;
      if (features.length > 0) {
        const rectCoords = features[0].geometry.coordinates[0];

        // const updatedArray = [...rectCoords];
        // updatedArray.pop();
        // console.log(updatedArray)
        dispatch(saveVenntelGeoPointsVariable(rectCoords))
      }
    }
  };
  // Initialize map when component mounts
  useEffect(() => {
    if (isInitialMount.current) {
      // This code will run only on the initial mount
      isInitialMount.current = false;
    } else {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapTileStyle,
        center: [-97.9222112121185, 39.3812661305678],
        zoom: 4,
      });
      map.doubleClickZoom.disable();
      mapRef.current = map;

      const drawInstance = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });
      setDraw(drawInstance);

      mapRef.current.addControl(drawInstance, 'top-right');
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      mapRef.current.on('draw.update', handleGetPointsInRect);
      mapRef.current.on('draw.update', handleVenntelGeoPoints);
      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  useEffect(() => {
    if (mapRef.current != null) {
      console.log(mapTileStyle)
      mapRef.current.setStyle(mapTileStyle)
    }
  }, [mapTileStyle])

  return (
    <div>
      <div className='topbar-container'>
        <div className='barBackground'>
        </div>
        <div
          style={{
            color: "white",
            marginLeft: "100px",
            fontSize: "30px",
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          ARGOS - Intelligence Platform
        </div>
        <div
          style={{
            color: "white",
            fontSize: "16px",
            zIndex: 1,
            alignItems: 'center',
            display: 'flex',
            position: 'absolute',
            left: '80%'
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "20px",
            }}
            alt="Remy Sharp"
            src={assets.images.avatar}
          />
          <div style={{ marginLeft: '10px' }}>{auth.currentUser?.displayName}</div>
          <img
            src={assets.images.logout}
            alt="Button label"
            style={{ width: "30px", height: "30px", marginLeft: '30px' }}
            onClick={() => { logout(auth) }}
          />
        </div>
      </div>

      <div className='sidebar-container'>
        <div className='barBackground'>
        </div>
        <div className='sidebar-icon-container'>

          <FontAwesomeIcon icon={faChartLine} className="sidebar-icons" onClick={() => { setIsDashboardVisible(true) }} />
          <FontAwesomeIcon icon={faLayerGroup} className="sidebar-icons" onClick={() => { setIsDataManagementVisible(true) }} />
          <FontAwesomeIcon icon={faSearch} className="sidebar-icons" onClick={() => { setIsQueryVisible(true) }} />
          <FontAwesomeIcon icon={faUser} className="sidebar-icons" onClick={() => { setIsAgentVisible(true) }} />
          <FontAwesomeIcon icon={faTools} className="sidebar-icons" onClick={() => { setIsToolVisible(true) }} />
          <FontAwesomeIcon icon={faTowerBroadcast} className="sidebar-icons" onClick={() => { setIsVenntelVisible(true) }} />
          <FontAwesomeIcon icon={faGear} className="sidebar-icons" onClick={() => { setIsSettingVisible(true) }} />
        </div>
      </div>

      {isDashboardVisible ?
        <Window title="Data Analysis" icon={faChartLine} initialSize={{ width: 500, height: 900 }} initialPosition={{ x: 1600, y: 100 }} onClose={() => { setIsDashboardVisible(false) }}>
          <Dashboard />

        </Window> : ""
      }

      {isDataManagementVisible ?
        <Window title="Data Layer" icon={faLayerGroup} initialSize={{ width: '90%', height: '90%' }} initialPosition={{ x: 100, y: 80 }} onClose={() => { setIsDataManagementVisible(false) }}>
          <DataManager
            handleAddWorkspaceClick={setWorkLayer}
            handleListLayerItemSelected={handleListLayerItemSelected} />
        </Window> : ""
      }

      {isQueryVisible ?
        <Window title="Query" icon={faSearch} initialSize={{ width: 400, height: 600 }} initialPosition={{ x: 100, y: 100 }} onClose={() => { setIsQueryVisible(false) }}>
          <SearchPanel onGeoFenceClick={handleGetPointsInRect} />
        </Window> : ""
      }

      {isVenntelVisible ?
        <Window title="ATS-CTD" icon={faTowerBroadcast} initialSize={{ width: 700, height: 900 }} initialPosition={{ x: 100, y: 100 }} onClose={() => { setIsVenntelVisible(false) }}>
          <VenntelPanel onBoundClick={handleVenntelGeoPoints} />
        </Window> : ""
      }

      {isToolVisible ?
        <Window title="Tool" icon={faTools} initialSize={{ width: 1200, height: 880 }} initialPosition={{ x: 100, y: 100 }} onClose={() => { setIsToolVisible(false) }}>
          <PDLTabs />
        </Window> : ""
      }

      {isSettingVisible ?
        <Window title="Setting" icon={faGear} initialSize={{ width: 800, height: 400 }} initialPosition={{ x: 100, y: 100 }} onClose={() => { setIsSettingVisible(false) }}>
          <MapStyleSelection onTileStyleChange={handleTileStyleChange} />
        </Window> : ""
      }
      {isAgentVisible ?
        <Window title="Agent" icon={faUser} initialSize={{ width: 1000, height: 550 }} initialPosition={{ x: 100, y: 100 }} onClose={() => { setIsAgentVisible(false) }}>
          <AgentPanel />
        </Window> : ""}


      <div
        style={
          loading
            ? {
              position: "absolute",
              zIndex: "10",
              textAlign: "center",
              width: "100%",
              height: "90%",
              display: "block",
            }
            : { display: "none" }
        }
      >
        <img src={assets.images.loading} style={{ marginTop: "10%" }} />
        <h2 style={{ color: "white", marginTop: "-10%" }}>Loading Layer</h2>
      </div>

      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

const Map = () => {
  return (
    <Provider store={store}>
      <MapComponent />
    </Provider>
  );
};
export default Map;

// export default Map;

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, MessageCircle } from "lucide-react";

import {
  ArrowLeft,
  Navigation,
  MapPin,
  Car,
  Footprints,
  Ship,
  Clock,
  Route,
  AlertTriangle,
} from "lucide-react";

import { Feature, FeatureCollection, LineString, Point } from "geojson";

type RoadFeature = Feature<
  LineString,
  { type: string; [key: string]: unknown }
>;
type RoadGeoJSON = FeatureCollection<
  LineString,
  { type: string; [key: string]: unknown }
>;

// Debugging location for Nigeria
const DEBUG_LOCATION_NIGERIA: [number, number] = [3.3792, 9.5244]; // Lagos, Nigeria // Abuja approx (lon, lat) Poor Quality [9.495, 11.057];

const SafeRoutePage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [transportMode, setTransportMode] = useState("walking");
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [roadsData, setRoadsData] = useState<RoadFeature[]>([]);

  const [nearestPointCoord, setNearestPointCoord] = useState<
    [number, number] | null
  >(null);

  type RecommendedRoute = {
    id: number;
    name: string;
    distance: string;
    time: string;
    safety: "Very High" | "High" | "Medium" | "Low";
    warnings: string[];
    landmarks: string[];
    snappedCoord: [number, number];
  };

  const [recommendedRoutes, setRecommendedRoutes] = useState<
    RecommendedRoute[]
  >([]);

  const [nearestRoadProperties, setNearestRoadProperties] = useState<{
    ROADNO?: string;
    LANES?: number;
    SURFTYPE?: string;
    PAVETYPE?: string;
    CONDITION?: string;
    WIDTH?: number;
  } | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  // Add a ref for the user location marker so we can update/remove it
  const userMarker = useRef<maplibregl.Marker | null>(null);

  const [debugMode, setDebugMode] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const findNextBestRoad = () => {
    if (!userLocation || !geoJsonData) return;

    const userPoint: Feature<Point> = turf.point(userLocation);
    const sortedRoads = geoJsonData.features
      .map((road: RoadFeature) => {
        const snapped = turf.nearestPointOnLine(road, userPoint);
        const distance = turf.distance(userPoint, snapped);
        return { road, snapped, distance };
      })
      .filter(({ road }) => road.properties.CONDITION !== "Poor")
      .sort((a, b) => a.distance - b.distance);

    const best = sortedRoads[0];
    if (!best) return;

    const { snapped, road } = best;
    setNearestPointCoord(snapped.geometry.coordinates as [number, number]);
    setNearestRoadProperties({
      ROADNO: road.properties.ROADNO as string,
      LANES: road.properties.LANES as number,
      SURFTYPE: road.properties.SURFTYPE as string,
      PAVETYPE: road.properties.PAVETYPE as string,
      CONDITION: road.properties.CONDITION as string,
      WIDTH: road.properties.WIDTH as number,
    });

    const route = turf.lineString([userLocation, snapped.geometry.coordinates]);

    if (map.current?.getSource("route_to_road")) {
      (
        map.current.getSource("route_to_road") as maplibregl.GeoJSONSource
      ).setData(route);
    } else {
      map.current?.addSource("route_to_road", {
        type: "geojson",
        data: route,
      });

      map.current?.addLayer({
        id: "route_to_road_layer",
        type: "line",
        source: "route_to_road",
        paint: {
          "line-color": "#ff0000",
          "line-width": 4,
          "line-dasharray": [2, 2],
        },
      });
    }

    const popup = new maplibregl.Popup({ closeOnClick: false })
      .setLngLat(snapped.geometry.coordinates as [number, number])
      .setHTML(
        `
      <div style="font-size:14px; font-weight:bold; line-height:1.4;">
        🚧 <strong>Alternative Road Info</strong><br/>
        <span>Road No:</span> ${road.properties.ROADNO || "N/A"}<br/>
        <span>Lanes:</span> ${road.properties.LANES || "N/A"}<br/>
        <span>Surface:</span> ${road.properties.SURFTYPE || "N/A"}<br/>
        <span>Pavement:</span> ${road.properties.PAVETYPE || "N/A"}<br/>
        <span>Condition:</span> ${road.properties.CONDITION || "N/A"}<br/>
        <span>Road Width:</span> ${
          road.properties.WIDTH || "N/A"
        } <span>m</span>
      </div>
    `
      )
      .addTo(map.current!);
  };

  const generateRecommendedRoutes = () => {
    if (!userLocation || !geoJsonData) return;

    const userPoint: Feature<Point> = turf.point(userLocation);
    const features = geoJsonData.features as RoadFeature[];

    const scoredRoads = features
      .map((road: RoadFeature, index: number) => {
        const snapped = turf.nearestPointOnLine(road, userPoint);
        const distance = turf.distance(userPoint, snapped, {
          units: "kilometers",
        });

        const condition = road.properties.CONDITION as string | undefined;
        const width = road.properties.WIDTH as number | undefined;

        let safety: "Very High" | "High" | "Medium" | "Low" = "Low";
        if (condition === "Very Good") safety = "Very High";
        else if (condition === "Good") safety = "High";
        else if (condition === "Fair") safety = "Medium";

        const route: RecommendedRoute = {
          id: index + 1,
          name: `Route via ${road.properties.ROADNO || "Unnamed Road"}`,
          distance: `${(distance * 1000).toFixed(1)} m`,
          time: `${Math.round((distance * 60) / 5)} min`,
          safety,
          warnings:
            condition === "Poor" ? ["Avoid this road – poor condition"] : [],
          landmarks: [
            `Width: ${width ?? "?"} m`,
            `Condition: ${condition ?? "Unknown"}`,
          ],
          snappedCoord: snapped.geometry.coordinates as [number, number],
        };

        return { route, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((entry) => entry.route);

    setRecommendedRoutes(scoredRoads);
  };

  const findNearestRoad = () => {
    if (!userLocation || !geoJsonData) return; // Guard statement

    const userPoint: Feature<Point> = turf.point(userLocation);
    const roads: RoadFeature[] = geoJsonData.features;

    let nearestPoint: Feature<Point> | null = null;
    let nearestDistance = Infinity;

    roads.forEach((road: RoadFeature) => {
      const snapped: Feature<Point> = turf.nearestPointOnLine(road, userPoint);
      const distance: number = turf.distance(userPoint, snapped);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPoint = snapped;

        // Save the road's properties as well
        setNearestRoadProperties({
          ROADNO: road.properties.ROADNO as string,
          LANES: road.properties.LANES as number,
          SURFTYPE: road.properties.SURFTYPE as string,
          PAVETYPE: road.properties.PAVETYPE as string,
          CONDITION: road.properties.CONDITION as string,
          WIDTH: road.properties.WIDTH as number,
        });
      }
    });

    if (nearestPoint) {
      setNearestPointCoord(
        nearestPoint.geometry.coordinates as [number, number]
      );

      const route: Feature<LineString> = turf.lineString([
        userLocation,
        nearestPoint.geometry.coordinates,
      ]);

      if (map.current?.getSource("route_to_road")) {
        (
          map.current.getSource("route_to_road") as maplibregl.GeoJSONSource
        ).setData(route);
      } else {
        map.current?.addSource("route_to_road", {
          type: "geojson",
          data: route,
        });

        map.current?.addLayer({
          id: "route_to_road_layer",
          type: "line",
          source: "route_to_road",
          paint: {
            "line-color": "#ff0000",
            "line-width": 4,
            "line-dasharray": [2, 2],
          },
        });
      }
      // 📍 Show Popup on map
      if (nearestRoadProperties) {
        const popup = new maplibregl.Popup({ closeOnClick: false })
          .setLngLat(nearestPoint.geometry.coordinates as [number, number])
          .setHTML(
            `
        <div style="font-size:14px; font-weight:bold; line-height:1.4;">
          🚧 <strong>Nearest Road Info</strong><br/>
          <span>Road No:</span> ${nearestRoadProperties.ROADNO || "N/A"}<br/>
          <span>Lanes:</span> ${nearestRoadProperties.LANES || "N/A"}<br/>
          <span>Surface:</span> ${nearestRoadProperties.SURFTYPE || "N/A"}<br/>
          <span>Pavement:</span> ${nearestRoadProperties.PAVETYPE || "N/A"}<br/>
          <span>Condition:</span> ${
            nearestRoadProperties.CONDITION || "N/A"
          }<br/>
          <span>Road Width:</span> ${
            nearestRoadProperties.WIDTH || "N/A"
          }<span> m</span>
        </div>
      `
          )
          .addTo(map.current);
      }
    }
  };

  // 🚀 Load GeoJSON data
  useEffect(() => {
    fetch("/data/nigeria_roads.geojson")
      .then((res) => res.json())
      .then((data: RoadGeoJSON) => {
        setGeoJsonData(data);
        setRoadsData(data.features);
      })
      .catch((err) => console.error("Failed to load GeoJSON", err));
  }, []);

  // 🗺️ Initialize map when data is loaded
  useEffect(() => {
    if (!geoJsonData || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
      center: [8.6753, 9.082], // Nigeria center
      zoom: 6,
    });

    map.current.on("load", () => {
      map.current!.addSource("nigeria_roads", {
        type: "geojson",
        data: geoJsonData,
      });

      map.current!.addLayer({
        id: "nigeria_roads_layer",
        type: "line",
        source: "nigeria_roads",
        paint: {
          "line-color": "#007cbf",
          "line-width": 1,
        },
      });
    });
  }, [geoJsonData]);

  useEffect(() => {
    if (userLocation && geoJsonData) {
      generateRecommendedRoutes();
    }
  }, [userLocation, geoJsonData]);

  // Function to locate user
  const locateUser = () => {
    if (debugMode) {
      const nigeriaLocation = DEBUG_LOCATION_NIGERIA;
      setUserLocation(nigeriaLocation);
      moveToLocation(nigeriaLocation);
      reverseGeocode(nigeriaLocation);
    } else {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setUserLocation(loc);
          moveToLocation(loc);
          reverseGeocode(loc);
        },
        () => {
          alert("Unable to retrieve your location");
        }
      );
    }
  };

  const moveToLocation = (location: [number, number]) => {
    if (!map.current) return;

    map.current.flyTo({
      center: location,
      zoom: 14,
      essential: true,
    });

    if (userMarker.current) {
      userMarker.current.setLngLat(location);
    } else {
      userMarker.current = new maplibregl.Marker({ color: "red" })
        .setLngLat(location)
        .addTo(map.current);
    }
  };
  const [placeName, setPlaceName] = useState<string | null>(null);

  const reverseGeocode = async ([lng, lat]: [number, number]) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const name =
        data.display_name ||
        data.name ||
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "Unknown location";
      setPlaceName(name);
    } catch (err) {
      console.error("Reverse geocoding failed", err);
      setPlaceName("Unknown location");
    }
  };

  function getSurfaceTypeLabel(code: string): string {
    const surfaceTypes: Record<string, string> = {
      AS: "Asphalt",
      GR: "Gravel",
      ER: "Earth",
      CB: "Cobblestone",
      CN: "Concrete",
      SD: "Sand",
      ST: "Stone",
      UN: "Unknown",
      BM: "Bituminous Material",
      BL: "Blacktop",
    };

    return surfaceTypes[code] || "Unknown Surface";
  }

  // 💡 Transport modes and static routes
  const transportModes = [
    { id: "walking", icon: Footprints, label: "Walking", time: "25 min" },
    { id: "car", icon: Car, label: "Car", time: "8 min" },
    { id: "boat", icon: Ship, label: "Boat", time: "15 min" },
  ];

  const safeRoutes = [
    {
      id: 1,
      name: "Main Street Route",
      distance: "2.1 km",
      time: "25 min",
      safety: "High",
      warnings: ["Avoid River Bridge - Flooded"],
      landmarks: ["Community Center", "High School", "Police Station"],
    },
    {
      id: 2,
      name: "Hill Path Route",
      distance: "3.2 km",
      time: "35 min",
      safety: "Very High",
      warnings: [],
      landmarks: ["Hill View Park", "Water Tower", "Fire Station"],
    },
  ];

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case "Very High":
        return "text-green-600 bg-green-100";
      case "High":
        return "text-blue-600 bg-blue-100";
      case "Medium":
        return "text-amber-600 bg-amber-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-6 w-6 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Safe Routes</h1>
        <div className="w-20" />
      </div>

      {/* Destination Input */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="row space-y-4">
            <div className="col space-y-2">
              <label className="text-sm font-medium mb-2 block">
                Locate your current position
                {placeName && (
                  <p className="mt-3 text-sm text-gray-600 italic">
                    You are near: <strong>{placeName}</strong>
                  </p>
                )}
              </label>

              <div className="col space-x-2 ">
                <Button variant="outline" onClick={locateUser}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>

              {nearestRoadProperties && (
                <div className="mb-4 p-4 border rounded bg-yellow-100 shadow-md">
                  <h3 className="font-bold mb-3 text-xl text-gray-800">
                    🚧 Nearest Road Info
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-lg text-gray-900 font-semibold">
                    <p>
                      <span className="text-gray-700">Road No:</span>{" "}
                      {nearestRoadProperties.ROADNO}
                    </p>
                    <p>
                      <span className="text-gray-700">Lanes:</span>{" "}
                      {nearestRoadProperties.LANES}
                    </p>
                    <p>
                      <span className="text-gray-700">Surface Type:</span>{" "}
                      {getSurfaceTypeLabel(nearestRoadProperties.SURFTYPE)}
                    </p>
                    {/* <p>
                      <span className="text-gray-700">Pavement Type:</span>{" "}
                      {nearestRoadProperties.PAVETYPE}
                    </p> */}
                    <p>
                      <span className="text-red-500">Condition:</span>{" "}
                      {nearestRoadProperties.CONDITION}
                    </p>
                    <p>
                      <span className="text-gray-700">Road Width:</span>{" "}
                      {nearestRoadProperties.WIDTH ?? "N/A"} <span>m</span>
                    </p>
                  </div>

                  {nearestRoadProperties.CONDITION === "Poor" && (
                    <Button
                      variant="default"
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                      onClick={findNextBestRoad}
                    >
                      Press to find alternative road
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="mb-4"
        onClick={() => setDebugMode((prev) => !prev)}
      >
        {debugMode ? "🔧 Debug Mode (Nigeria)" : "📍 Real Location Mode"}
      </Button>

      {/* 🗺️ Real Map Viewer */}
      <Card className="mb-6 h-64">
        <CardContent className="p-0 h-full">
          <div ref={mapContainer} className="w-full h-full rounded" />
        </CardContent>
      </Card>

      <Button variant="default" className="mb-4 ml-2" onClick={findNearestRoad}>
        🧭 Route to Nearest Road
      </Button>
      {userLocation && nearestPointCoord && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-4 ms-3 hover:bg-green-700 transition-colors"
          onClick={() => {
            const [startLng, startLat] = userLocation;
            const [endLng, endLat] = nearestPointCoord;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=walking`;
            window.open(url, "_blank");
          }}
        >
          Open in Google Maps
        </button>
      )}

      {/* Safe Route Recommendations */}
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Navigation className="h-6 w-6 mr-2 text-green-500" />
          Recommended Safe Routes
        </h2>
        {recommendedRoutes.length > 0 ? (
          recommendedRoutes.map((route) => (
            <Card key={route.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{route.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {route.distance}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {route.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSafetyColor(
                      route.safety
                    )}`}
                  >
                    {route.safety} Safety
                  </span>
                </div>

                {route.warnings.length > 0 && (
                  <div className="mb-3">
                    {route.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="flex items-center text-amber-600 bg-amber-50 p-2 rounded text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {warning}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Road Details:</p>
                  <div className="flex flex-wrap gap-1">
                    {route.landmarks.map((landmark, index) => (
                      <span
                        key={index}
                        className="bg-muted px-2 py-1 rounded text-xs"
                      >
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full gradient-safe text-white border-0"
                  onClick={() => {
                    const [startLng, startLat] = userLocation!;
                    const [endLng, endLat] = route.snappedCoord;
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=walking`;
                    window.open(url, "_blank");
                  }}
                >
                  Start Navigation
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">
            Locate your position to get safe route recommendations.
          </div>
        )}
      </div>

      {/* Volunteer List */}
      <div className="mb-6 max-h-64 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">📋 Registered Volunteers</h2>
        {(() => {
          const volunteers = JSON.parse(
            localStorage.getItem("volunteers") || "[]"
          );

          if (volunteers.length === 0) {
            return (
              <div className="text-muted-foreground italic">
                No volunteers have registered yet.
              </div>
            );
          }

          return volunteers.map((volunteer, index) => (
            <Card key={index} className="mb-2">
              <CardContent className="p-3 flex items-center ">
                <p className="font-semibold ">{volunteer.name}</p>
                <p className="text-sm">📞 {volunteer.phone}</p>
                <p className="text-sm">📍 {volunteer.location}</p>
                <div className="flex justify-end gap-2 mt-2 ms-auto">
                  {/* Message Button */}
                  <button
                    onClick={() => navigate("/offline-chat")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>

                  {/* Call Button */}
                  <button
                    onClick={() => (window.location.href =`tel:${volunteer.phone}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              </CardContent>
            </Card>
          ));
        })()}
      </div>

      {/* Emergency Notice */}
      <Card className="bg-red-50 border-red-200 mb-20">
        <CardContent className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 text-sm font-medium">
              Always check current conditions before traveling. Turn back if
              water is rising.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeRoutePage;

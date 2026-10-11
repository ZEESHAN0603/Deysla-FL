import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation, Building2, Globe2, Compass } from "lucide-react";

export interface HubLocation {
  id: string;
  name: string;
  badge: string;
  region: string;
  country: string;
  city: string;
  address: string;
  coords: { lat: number; lng: number };
  zoom: number;
  phone: string;
  phoneRaw: string;
  email: string;
  hours: string;
  scope: string;
  googleMapsUrl: string;
}

export const HUB_LOCATIONS: HubLocation[] = [
  {
    id: "saudi",
    name: "DEYSLA Saudi Arabia Hub",
    badge: "Primary Operations Hub",
    region: "SAUDI ARABIA",
    country: "Kingdom of Saudi Arabia",
    city: "Dammam",
    address: "Al Khalidiya District, Dammam 32223",
    coords: { lat: 26.4207, lng: 50.1039 },
    zoom: 14,
    phone: "+966-544553670",
    phoneRaw: "+966544553670",
    email: "enquiry-sa@deysla.com",
    hours: "8:00 am – 9:00 pm (Sun – Thu)",
    scope: "Enterprise IT hardware staging, logistics & regional field engineering",
    googleMapsUrl: "https://maps.google.com/?q=Al+Khalidiya+Dammam+Saudi+Arabia",
  },
  {
    id: "bahrain",
    name: "DEYSLA Bahrain Facility",
    badge: "Industrial Logistics Facility",
    region: "BAHRAIN",
    country: "Kingdom of Bahrain",
    city: "Al Hidd",
    address: "BIW Business Park, Al Hidd Industrial Area",
    coords: { lat: 26.2165, lng: 50.6655 },
    zoom: 14,
    phone: "+973-33999611",
    phoneRaw: "+97333999611",
    email: "enquiry-bh@deysla.com",
    hours: "8:00 am – 9:00 pm",
    scope: "Regional distribution, automated systems support & client services",
    googleMapsUrl: "https://maps.google.com/?q=BIW+Business+Park+Al+Hidd+Bahrain",
  },
  {
    id: "usa",
    name: "DEYSLA United States Office",
    badge: "Strategic Alliances",
    region: "USA",
    country: "United States",
    city: "Charleston, West Virginia",
    address: "Charleston, W. Virginia 25301",
    coords: { lat: 38.3498, lng: -81.6326 },
    zoom: 14,
    phone: "+1 (215) 827 7344",
    phoneRaw: "+12158277344",
    email: "enquiry-us@deysla.com",
    hours: "8:00 am – 9:00 pm (EST)",
    scope: "Tier-1 OEM alliances, partner management & North American procurement",
    googleMapsUrl: "https://maps.google.com/?q=Charleston+West+Virginia+USA",
  },
];

// Helper camera controller to smoothly pan/zoom when location changes
const MapCameraController: React.FC<{
  targetLocation: HubLocation | null;
  overviewMode: boolean;
}> = ({ targetLocation, overviewMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (overviewMode) {
      // Middle East region overview covering both Dammam and Bahrain
      map.panTo({ lat: 26.32, lng: 50.38 });
      map.setZoom(9);
    } else if (targetLocation) {
      map.panTo(targetLocation.coords);
      map.setZoom(targetLocation.zoom);
    }
  }, [map, targetLocation, overviewMode]);

  return null;
};

export const ContactLocationsMap: React.FC = () => {
  const rawKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const apiKey = rawKey && rawKey !== "MY_GOOGLE_MAPS_API_KEY" ? rawKey : "";
  const [selectedHub, setSelectedHub] = useState<HubLocation>(HUB_LOCATIONS[0]);
  const [activeInfoWindow, setActiveInfoWindow] = useState<HubLocation | null>(HUB_LOCATIONS[0]);
  const [isOverviewMode, setIsOverviewMode] = useState<boolean>(false);

  const handleSelectLocation = (hub: HubLocation) => {
    setSelectedHub(hub);
    setActiveInfoWindow(hub);
    setIsOverviewMode(false);
  };

  const handleOverviewToggle = () => {
    setIsOverviewMode(true);
    setActiveInfoWindow(null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-300 text-black text-xs font-bold tracking-wide uppercase mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            Interactive Global Facility Locator
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Our Regional Facilities &amp; Hub Locations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Select an operational facility below to view live coordinates, operating hours, direct lines, and geographic placement across our global footprint.
          </p>
        </div>

        {/* Global Overview Action */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <button
            type="button"
            onClick={handleOverviewToggle}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              isOverviewMode
                ? "bg-black text-white border-black shadow-xs"
                : "bg-white text-neutral-800 border-neutral-300 hover:border-black hover:bg-neutral-50"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-black" />
            <span>Regional Overview</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Compact Side-by-Side Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Facility Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            {HUB_LOCATIONS.map((loc) => {
              const isSelected = !isOverviewMode && selectedHub.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleSelectLocation(loc);
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-neutral-100 border-black shadow-xs ring-1 ring-black/20"
                      : "bg-white border-neutral-200 hover:border-black hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                      </span>
                      <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wide">
                        {loc.region}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-black text-white"
                          : "bg-neutral-100 text-neutral-800 border border-neutral-300"
                      }`}
                    >
                      {loc.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-900 mb-1">{loc.name}</p>

                  <div className="space-y-1 text-[11px] text-neutral-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                    <a
                      href={`tel:${loc.phoneRaw}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono font-medium text-neutral-800 hover:text-black flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-black" />
                      <span>{loc.phone}</span>
                    </a>
                    <a
                      href={loc.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold text-black hover:underline flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Helper Note */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Direct site visits welcome during standard operating hours.</span>
            </span>
          </div>
        </div>

        {/* Right Column: Google Maps Container (7 cols) */}
        <div className="lg:col-span-7">
          <div className="w-full h-[340px] sm:h-[420px] lg:h-[460px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm relative flex flex-col">
            {apiKey ? (
              <APIProvider apiKey={apiKey}>
                {/* Floating Map Status Overlay */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none max-w-[calc(100%-20px)]">
                  <div className="pointer-events-auto bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                    </span>
                    <span className="font-bold text-neutral-900 truncate">
                      {isOverviewMode ? "Regional View (GCC)" : selectedHub.name}
                    </span>
                    <span className="text-neutral-400 hidden sm:inline">|</span>
                    <span className="hidden sm:inline text-[11px] font-mono text-neutral-600">
                      {isOverviewMode
                        ? "Dammam & Bahrain"
                        : `${selectedHub.coords.lat.toFixed(4)}° N, ${selectedHub.coords.lng.toFixed(4)}° E`}
                    </span>
                  </div>
                </div>

                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={HUB_LOCATIONS[0].coords}
                  defaultZoom={14}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  fullscreenControl={true}
                  streetViewControl={false}
                  mapTypeControl={false}
                  zoomControl={true}
                  className="w-full h-full"
                  internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                >
                  <MapCameraController
                    targetLocation={selectedHub}
                    overviewMode={isOverviewMode}
                  />

                  {/* Render Markers for all locations */}
                  {HUB_LOCATIONS.map((loc) => {
                    const isLocSelected = !isOverviewMode && selectedHub.id === loc.id;
                    return (
                      <AdvancedMarker
                        key={loc.id}
                        position={loc.coords}
                        title={loc.name}
                        onClick={() => {
                          setSelectedHub(loc);
                          setActiveInfoWindow(loc);
                          setIsOverviewMode(false);
                        }}
                      >
                        <Pin
                          background={isLocSelected ? "#000000" : "#525252"}
                          borderColor="#ffffff"
                          glyphColor="#ffffff"
                          scale={isLocSelected ? 1.25 : 1.0}
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {/* Interactive Info Window */}
                  {activeInfoWindow && (
                    <InfoWindow
                      position={activeInfoWindow.coords}
                      onCloseClick={() => setActiveInfoWindow(null)}
                      headerContent={
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 pr-2">
                          <Building2 className="w-3.5 h-3.5 text-black" />
                          <span>{activeInfoWindow.name}</span>
                        </div>
                      }
                    >
                      <div className="p-1 space-y-2 text-xs text-neutral-800 max-w-xs">
                        <div className="flex items-start gap-1 text-[11px] text-neutral-600">
                          <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                          <span>{activeInfoWindow.address}</span>
                        </div>
                        <div className="text-[11px] text-neutral-600">
                          <span className="font-semibold text-neutral-900">Hours: </span>
                          <span>{activeInfoWindow.hours}</span>
                        </div>
                        <div className="text-[11px] text-neutral-600">
                          <span className="font-semibold text-neutral-900">Phone: </span>
                          <a
                            href={`tel:${activeInfoWindow.phoneRaw}`}
                            className="font-mono text-black font-semibold hover:underline"
                          >
                            {activeInfoWindow.phone}
                          </a>
                        </div>
                        <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                          <a
                            href={activeInfoWindow.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-black hover:underline"
                          >
                            <span>Open Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={`mailto:${activeInfoWindow.email}`}
                            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </a>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              /* Fallback view if API key is not present */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black text-white">
                <MapPin className="w-10 h-10 text-white mb-3 animate-pulse" />
                <h3 className="text-base font-bold mb-1">DEYSLA Facilities Location Map</h3>
                <p className="text-xs text-neutral-400 max-w-md mb-4">
                  Explore our verified regional hubs in Dammam (Saudi Arabia), BIW Business Park (Bahrain), and Charleston (USA).
                </p>
                <a
                  href={selectedHub.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Open {selectedHub.region} Location in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

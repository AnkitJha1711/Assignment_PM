import React from "react";

function MapView({ events, selectedMap, heatmapType }) {

  const currentMap =
    selectedMap !== "All"
      ? selectedMap
      : events?.[0]?.map_id || "AmbroseValley";

  const mapImages = {
    AmbroseValley: "/minimaps/AmbroseValley_Minimap.png",
    GrandRift: "/minimaps/GrandRift_Minimap.png",
    Lockdown: "/minimaps/Lockdown_Minimap.jpg",
  };

  const heatmapPoints = (events || []).filter(e => {
    if (heatmapType === "kill") return ["Kill", "BotKill"].includes(e.event);
    if (heatmapType === "loot") return e.event === "Loot";
    if (heatmapType === "death") return ["Killed", "BotKilled"].includes(e.event);
    return false;
  });

  return (
    <div style={{ position: "relative", width: "1024px", height: "1024px" }}>

      <img
        src={mapImages[currentMap]}
        alt="map"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />

      <svg width="1024" height="1024" style={{ position: "absolute" }}>

        {/* HEATMAP */}
        {heatmapType !== "none" &&
          heatmapPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.pixel_x}
              cy={p.pixel_y}
              r="20"
              fill={
                heatmapType === "kill" ? "red" :
                heatmapType === "loot" ? "green" :
                "orange"
              }
              opacity="0.05"
            />
          ))
        }

      </svg>
    </div>
  );
}

export default MapView;
import { useState } from "react";

function MapView({ events, selectedMap }) {

  const [showHeatmap, setShowHeatmap] = useState(false);

  const currentMap =
    selectedMap !== "All"
      ? selectedMap
      : events?.[0]?.map_id || "AmbroseValley";

  const mapImages = {
    AmbroseValley: "/minimaps/AmbroseValley_Minimap.png",
    GrandRift: "/minimaps/GrandRift_Minimap.png",
    Lockdown: "/minimaps/Lockdown_Minimap.jpg",
  };

  // 🔥 PERFORMANCE FIX (LIMIT DATA)
  const movement = (events || [])
    .filter((e) =>
      ["Position", "BotPosition"].includes(e.event)
    )
    .slice(0, 1500);

  const loot = (events || [])
    .filter((e) => e.event === "Loot")
    .slice(0, 300);

  const kills = (events || [])
    .filter((e) =>
      ["Kill", "BotKill"].includes(e.event)
    )
    .slice(0, 200);

  const deaths = (events || [])
    .filter((e) =>
      ["Killed", "BotKilled"].includes(e.event)
    )
    .slice(0, 200);

  const storm = (events || [])
    .filter((e) => e.event === "KilledByStorm")
    .slice(0, 100);

  // 🔥 NEW: Heatmap data
  const heatmapPoints = (events || [])
    .filter((e) =>
      ["Kill", "BotKill", "Loot", "Killed", "BotKilled"].includes(e.event)
    )
    .slice(0, 2000);

  return (
    <div>

      {/* 🔥 TOGGLE BUTTON */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setShowHeatmap(!showHeatmap)}>
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>
      </div>

      <div
        style={{
          position: "relative",
          width: "1024px",
          height: "1024px",
        }}
      >
        {/* MAP */}
        <img
          src={mapImages[currentMap]}
          alt="map"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />

        {/* SVG */}
        <svg
          width="1024"
          height="1024"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >

          {/* 🔥 HEATMAP */}
          {showHeatmap &&
            heatmapPoints.map((p, i) => (
              <circle
                key={"heat" + i}
                cx={p.pixel_x}
                cy={p.pixel_y}
                r="20"
                fill="red"
                opacity="0.05"
              />
            ))}

          {/* Movement */}
          {movement.map((p, i) => {
            if (i === 0) return null;

            return (
              <line
                key={i}
                x1={movement[i - 1].pixel_x}
                y1={movement[i - 1].pixel_y}
                x2={p.pixel_x}
                y2={p.pixel_y}
                stroke={
                  p.player_type === "Bot"
                    ? "gray"
                    : "blue"
                }
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          {/* Loot */}
          {loot.map((p, i) => (
            <circle
              key={"loot" + i}
              cx={p.pixel_x}
              cy={p.pixel_y}
              r="4"
              fill="lime"
            />
          ))}

          {/* Kills */}
          {kills.map((p, i) => (
            <circle
              key={"kill" + i}
              cx={p.pixel_x}
              cy={p.pixel_y}
              r="5"
              fill="red"
            />
          ))}

          {/* Deaths */}
          {deaths.map((p, i) => (
            <circle
              key={"death" + i}
              cx={p.pixel_x}
              cy={p.pixel_y}
              r="5"
              fill="orange"
            />
          ))}

          {/* Storm */}
          {storm.map((p, i) => (
            <circle
              key={"storm" + i}
              cx={p.pixel_x}
              cy={p.pixel_y}
              r="6"
              fill="purple"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default MapView;
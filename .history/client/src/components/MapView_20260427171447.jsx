function MapView({ events }) {
  if (!events || !events.length) return null;

  // detect current map
  const currentMap = events[0]?.map_id;

  const mapImages = {
    AmbroseValley: "/minimaps/AmbroseValley_Minimap.png",
    GrandRift: "/minimaps/GrandRift_Minimap.png",
    Lockdown: "/minimaps/Lockdown_Minimap.jpg",
  };

  const movement = events
    .filter(
      (e) => e.event === "Position" || e.event === "BotPosition"
    )
    .slice(0, 2000);

  const loot = events
    .filter((e) => e.event === "Loot")
    .slice(0, 300);

  const kills = events
    .filter((e) =>
      ["Kill", "BotKill"].includes(e.event)
    )
    .slice(0, 200);

  const deaths = events
    .filter((e) =>
      ["Killed", "BotKilled"].includes(e.event)
    )
    .slice(0, 200);

  const storm = events
    .filter((e) => e.event === "KilledByStorm")
    .slice(0, 100);

  return (
    <div
      style={{
        position: "relative",
        width: "1024px",
        height: "1024px",
      }}
    >
      {/* Dynamic Map Image */}
      <img
        src={mapImages[currentMap]}
        alt="map"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      <svg
        width="1024"
        height="1024"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
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
  );
}

export default MapView;
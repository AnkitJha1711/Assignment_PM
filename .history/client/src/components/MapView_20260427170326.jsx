function MapView({ events }) {
  if (!events || !events.length) return null;

  const movement = events
    .filter(
      (e) => e.event === "Position" || e.event === "BotPosition"
    )
    .slice(0, 2000);

  const loot = events
    .filter((e) => e.event === "Loot")
    .slice(0, 300);

  return (
    <div
      style={{
        position: "relative",
        width: "1024px",
        height: "1024px",
      }}
    >
      <img
        src="/minimaps/AmbroseValley_Minimap.png"
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
        {movement.map((p, i) => {
          if (i === 0) return null;

          return (
            <line
              key={i}
              x1={movement[i - 1].pixel_x}
              y1={movement[i - 1].pixel_y}
              x2={p.pixel_x}
              y2={p.pixel_y}
              stroke="blue"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {loot.map((p, i) => (
          <circle
            key={i}
            cx={p.pixel_x}
            cy={p.pixel_y}
            r="4"
            fill="lime"
          />
        ))}
      </svg>
    </div>
  );
}

export default MapView;
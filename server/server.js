const express = require("express");
const cors = require("cors");

const eventsRoutes = require("./routes/eventsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventsRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
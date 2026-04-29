const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use("/src", express.static(path.join(__dirname, "src")));

// Serve root files
app.use(express.static(__dirname));

// Fallback only for non-file routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

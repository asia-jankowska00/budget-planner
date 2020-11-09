const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/currencies", require("./routes/currencies"));
app.use("/api/sources", [auth], require("./routes/sources"));
app.use("/api/containers", [auth], require("./routes/containers"));

//categories
app.use("/api/containers/:containerId/categories", [auth], require("./routes/categories"));

// transactions
app.use("/api/containers/:containerId/transactions", [auth], require("./routes/transactions"));
app.use("/api/sources/:sourceId/transactions", [auth], require("./routes/transactions"));
app.use("/api/transactions", [auth], require("./routes/transactions"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

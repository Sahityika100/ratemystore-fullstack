const express = require('express');
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userDashboardRoutes = require("./routes/userdbRoutes");
const storeRoutes = require("./routes/storeownerRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userDashboardRoutes);
app.use("/api/store", storeRoutes)

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
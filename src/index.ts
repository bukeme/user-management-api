const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/addresses", addressRoutes);
app.use("/posts", postRoutes);

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});

import express from "express";
import proxy from "express-http-proxy";

const app = express();
const port = 3000;

app.use("/auth", proxy("http://localhost:3001"));

app.listen(port, () => {
  console.log(`Api gateway running on port ${port}.`);
});

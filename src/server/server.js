const express = require("express")
const app = express();
const path = require("path");

const port = 3000;

app.use(express.static("src/frontend/public"))

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
});
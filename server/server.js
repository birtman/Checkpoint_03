require("dotenv").config();

const server = require("./app");
const port = 6000;

server.listen(port, () => console.log(`Server running on port: ${port}`));

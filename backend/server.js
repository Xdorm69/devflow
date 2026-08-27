import app from './app.js';
import config from "./configs/config.js";

app.listen(config.PORT, () => {
    console.log("DevFlow-Backend running at http://localhost:" + config.PORT);
})
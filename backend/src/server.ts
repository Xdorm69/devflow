import app from './app.ts';
import config from './configs/config.ts';

app.listen(config.PORT, () => {
    console.log("DevFlow-Backend running at http://localhost:" + config.PORT);
})
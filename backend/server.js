// Entry point: builds the Express app and starts listening on PORT.
import { env } from './src/config/env.js';
import app from './src/app.js';

app.listen(env.port);

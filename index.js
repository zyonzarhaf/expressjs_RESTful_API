import app from './app.js';
import envVars from './config/envVars.js';
import connectDB from './database/db.js';

const { PORT, URI } = envVars;

app.listen(PORT, async function () {
    console.log(`server is listening on port ${PORT}`);
    await connectDB(URI); 
});

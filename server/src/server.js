import app from './app/app.js'
import connectDb from './config/db.js';
import config from './config/config.js';

await connectDb()

const PORT = config.PORT || 3000

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
})
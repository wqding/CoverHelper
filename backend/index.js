import express from "express";
import bodyParser from "body-parser";
import secure from 'ssl-express-www';
import { coverLetterController } from "./Controllers/CoverLetterController.js";
import Queue from 'bull';
import path from 'path';

const app = express();
const router = express.Router()

// Middleware
app.use(secure);
app.use(function(req, res, next) {
  const allowedOrigin = 'http://localhost:3000';

  if (allowedOrigin === req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(200).end();
  } else {
    next();
  }
});
app.use(bodyParser.json({limit: '5mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// Create a named work queue
const generateQueue = new Queue('generate', {
    redis: {
      port: process.env.REDIS_PORT, 
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD
    }
  } 
);

// router
router.post('/generate', coverLetterController)
router.get('/generate/job/:id', async (req, res) => {
  let id = req.params.id;
  let job = await generateQueue.getJob(id);

  if (job === null) {
    res.status(404).end();
  } else {
    let state = await job.getState();
    res.json({ id, state, progress: job._progress, reason: job.failedReason, return: job.returnvalue });
  }
});

app.use('/', router);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "landing/out")));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'landing/out', 'index.html'));
  });

  // Serve static files from the frontend/build folder for other routes
  app.use(express.static(path.join(__dirname, "frontend/build")));

  // Serve the frontend index page for any other route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'));
  });
}


app.listen(process.env.PORT, () =>
  console.log('Listening on port 5001!'),
);

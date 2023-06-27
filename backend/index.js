import express from "express";
import bodyParser from "body-parser";
import secure from 'ssl-express-www';
import cors from "cors";
import { generateCoverLetter } from "./Controllers/CoverLetterController.js";
import path from 'path';

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://coverhelper.live', 'https://coverhelper.live', 'https://coverhelper.herokuapp.com/'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(secure);
app.use(bodyParser.json({limit: '1mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));

const router = express.Router()
router.post('', generateCoverLetter)

// --------------------------deployment------------------------------

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

// --------------------------deployment------------------------------

app.listen(process.env.PORT, () =>
  console.log('Listening on port 5001!'),
);

app.use('/generate', router);

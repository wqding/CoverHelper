import express from "express";
import bodyParser from "body-parser";
import secure from 'ssl-express-www';
import { generateCoverLetter } from "./Controllers/CoverLetterController.js";
import path from 'path';

const app = express();
const router = express.Router()

// Middleware
app.use(secure);

// app.use(function(req, res, next) {
//   const allowedOrigins = ['https://coverhelper.live', 'https://coverhelper.herokuapp.com', 'http://localhost:3000'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   if (req.method === 'OPTIONS') {
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.status(200).end();
//   } else {
//     next();
//   }
// });

app.use(bodyParser.json({limit: '5mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

router.post('/generate', generateCoverLetter)

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
app.use('/', router);


app.listen(process.env.PORT, () =>
  console.log('Listening on port 5001!'),
);

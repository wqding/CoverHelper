import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateCoverLetter } from "./Controllers/CoverLetterController.js";
import path from 'path';

const app = express();

// Middleware
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors())

const router = express.Router()
router.post('', generateCoverLetter)

// --------------------------deployment------------------------------

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// --------------------------deployment------------------------------

app.listen(process.env.PORT, () =>
  console.log('Listening on port 5001!'),
);

app.use('/generate', router);

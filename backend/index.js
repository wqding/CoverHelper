import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateCoverLetter } from "./Controllers/CoverLetterController.js";

const app = express();

// Middleware
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors())

const router = express.Router()
router.post('', generateCoverLetter)

app.listen(5001, () =>
  console.log('Listening on port 5001!'),
);

app.use('/generate', router);

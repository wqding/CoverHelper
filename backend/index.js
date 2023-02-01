import express from "express";
import { generateCoverLetter } from "./Controllers/CoverLetterController.js";

const app = express();
const router = express.Router()
router.post('/', generateCoverLetter)

app.listen(3000, () =>
  console.log('Listening on port 3000!'),
);

app.use('/generate', router);

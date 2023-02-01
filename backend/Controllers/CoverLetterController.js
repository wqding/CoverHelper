import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateCoverLetter = async(req,res) => {
    if (!configuration.apiKey) {
        res.status(500).json({
          error: {
            message: "OpenAI API key not configured",
          }
        });
        return;
      }

    const resume = req.body.resume;
    const job_desc = req.body.desc;

    // call chat gpt api 
    try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: generatePrompt(resume,job_desc),
          temperature: 0.6,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
      } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            }
          });
        }
      }
}

function generatePrompt(resume, job_desc) {
    return `Given a resume with these experiences: "${resume}", and this job description: "${job_desc}",
    write a tailored cover letter for the job matching the resume skills to the job description requirements`;
  }
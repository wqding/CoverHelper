import dotenv from 'dotenv-safe'
import { ChatGPTAPI } from 'chatgpt'

dotenv.config()

const chatgptAPI = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })

export const generateCoverLetter = async(req,res) => {
    const resume = req.body.resume;
    const jobDesc = req.body.desc;

    // call chat gpt api 
    try {
      let chatRes = await chatgptAPI.sendMessage(generatePrompt(resume, jobDesc),{
        onProgress: (partialResponse) => {
          // do something
          // console.log(partialResponse)
        },
        timeoutMs: 60 * 1000, // 1 min timeout
      })
  
      return res.status(200).json({message: chatRes.text})

    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with ChatGPT api request: ${error.message}`);
        return res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
}
 
// TODO: improve prompt (maybe split company info and job description into sections)
// Make it return the parse resume along with CV: skills, experience 
function generatePrompt(resume, jobDesc) {
  return `Write a cover letter for the following job description using the provided resume. In the body, paraphrase this structure: "I demonstrated {one skill required for the job or a company value} in {past experience from resume} by {example from resume}"
  resume: "${resume}"
  job description: "${jobDesc}"`;
}
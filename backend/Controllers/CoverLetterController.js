// import dotenv from 'dotenv-safe'
import { ChatGPTUnofficialProxyAPI, ChatGPTAPI  } from 'chatgpt'
import Authenticator from "openai-authenticator";

// dotenv.config({silent: true})

// const chatgptAPI = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })

const authenticator = new Authenticator();
const loginInfo = await authenticator.login(process.env.OPENAI_EMAIL, process.env.OPENAI_PASSWORD)
const chatgptAPI = new ChatGPTUnofficialProxyAPI({ accessToken: loginInfo.accessToken })

export const generateCoverLetter = async(req,res) => {
    const resume = req.body.resume;
    const jobDesc = req.body.desc;
    
    // call chat gpt api 
    try {
      let chatRes = await chatgptAPI.sendMessage(generatePrompt(resume, jobDesc),{
        onProgress: (partialResponse) => {
          // console.log(partialResponse)
        },
        timeoutMs: 60 * 1000,
      })
  
      return res.status(200).json({message: Buffer.from(chatRes.text).toString('base64')})

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
  return `You are a cover letter writer. Below is a job description and my resume. 
  Please write a short attention-grabbing cover letter for this role with at most 2 body paragraphs
  Infuse a personality that is professional but fun. Do NOT utilize the exact same phrasing from the job description within the letter. 
  It should be well-written and completely unique. Any examples you use from my professional experience should be highly relevant to the job.

  Job Description: "${jobDesc}"
  Resume: "${resume}"`
}
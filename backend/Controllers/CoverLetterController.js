import dotenv from 'dotenv-safe'
import { ChatGPTUnofficialProxyAPI, ChatGPTAPI  } from 'chatgpt'
import Authenticator from "openai-authenticator";

dotenv.config({silent: true})

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
          // do something
          // console.log(partialResponse)
        },
        timeoutMs: 60 * 1000, // 1 min timeout
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
  return `Write a cover letter for the following job description using the provided resume."
  resume: "${resume}"
  job description: "${jobDesc}"
  There can be at most 2 body paragraphs, they must highlight elements of the resume that match 
  the job description and company culture and values, and explain how my past experiences translate 
  well into this job. Do not make anything up that is not on the resume, and keep it to the point.`;
}
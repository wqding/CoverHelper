import dotenv from 'dotenv-safe'
import { Configuration, OpenAIApi } from "openai";
import { contentOptions } from '../constants.js'

dotenv.config({silent: true})

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export const generateCoverLetter = async(req,res) => {
    const resume = req.body.resume;
    const input = req.body.input;
    const tone = req.body.tone;
    const contentType = req.body.contentType;
    const recipientName = req.body.recipientName;
    
    // call chat gpt api 
    try {
      let chatRes = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(resume, input, contentType, tone, recipientName),
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0.4,
        presence_penalty: 0.4,
      });

      console.log(chatRes.data.choices[0].text)
  
      return res.status(200).json({message: Buffer.from(chatRes.data.choices[0].text, 'utf8').toString('base64')})

    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with api request: ${error.message}`);
        return res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
}
 
// TODO: Make it return the parse resume along with CV: skills, experience 
const generatePrompt = (resume, input, contentType, tone, recipientName) => {
  switch(contentType) {
    case contentOptions.COVER_LETTER.enum:
      return coverLetterPrompt(resume, input, tone);
    case contentOptions.LETTER_OF_INTENT.enum:
      return letterOfIntentPrompt(resume, input, tone);
    case contentOptions.COLD_EMAIL.enum:
      return coldEmailPrompt(resume, input, tone, recipientName);
  }
}

const coldEmailPrompt = (resume, companyDescription, tone, recipientName) => {
  return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Please write a cold email ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- It should have at most 2 body paragraphs
- Explain how my experience's translate into soft skills that align with the company
- Highlight my enthusiasm for the company
- Use a ${tone === 0 ? 'witty and fun' : 'professional'} tone.`
}

const letterOfIntentPrompt = (resume, companyDescription, tone) => {
  return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Please write a letter of intent for this company asking for roles similar to the ones on my resume:
- It should highlight my qualifications and enthusiasm for the company
- It should have at most 2 body paragraphs
- Do NOT USE THE EXACT SAME PHRASING from the company description
- Any examples you use SHOULD BE FROM MY RESUME
- Use a ${tone === 0 ? 'witty and fun' : 'professional'} tone.`;
}

const coverLetterPrompt = (resume, jobDescription, tone) => {
  return `Below is a job description and my resume.

Job Description: "${jobDescription}"
Resume: "${resume}"

Please write a cover letter for this job:
- It should highlight my qualifications and enthusiasm for the job
- It should have at most 2 body paragraphs
- DO NOT simply list my skills, explain why they are relevant to the job
- DO NOT USE THE EXACT SAME PHRASING from the company description
- Any examples you use SHOULD BE FROM MY RESUME AND BE RELEVANT TO THE JOB.
- Use a ${tone === 0 ? 'witty and fun' : 'professional'} tone.`;
}
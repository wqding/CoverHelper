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
    const question = req.body.question;
    
    try {
      let chatRes = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": generatePrompt(resume, input, contentType, tone, recipientName, question)}],
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
      });

      // console.log(chatRes.data.choices)
  
      return res.status(200).json({message: Buffer.from(chatRes.data.choices[0].message.content, 'utf8').toString('base64')})

    } catch(error) {
      if (error.response) {
        // console.error(error.response.status, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else {
        // console.error(`Error with api request: ${error.message}`);
        return res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
}
 
const generatePrompt = (resume, input, contentType, tone, recipientName, question) => {
  switch(contentType) {
    case contentOptions.COVER_LETTER.enum:
      return coverLetterPrompt(resume, input, tone);
    case contentOptions.LETTER_OF_INTENT.enum:
      return letterOfIntentPrompt(resume, input, tone);
    case contentOptions.COLD_EMAIL.enum:
      return coldEmailPrompt(resume, input, tone, recipientName);
    case contentOptions.CUSTOM_QUESTION_ANSWER.enum:
      return customQuestionPrompt(resume, input, tone, question);
    case contentOptions.LINKEDIN_MESSAGE.enum:
      return linkedInMsgPrompt(resume, input, tone, recipientName);
    case contentOptions.LINKEDIN_CONNECTION_REQUEST_MESSAGE.enum:
      return connectionRequestMsgPrompt(resume, input, tone, recipientName);
    default:
      return coverLetterPrompt(resume, input, tone);
  }
}

const customQuestionPrompt = (resume, input, tone, question) => {
  return `You are applying to a job, below is a job or company description and my resume.

  Company or Job Description: "${input}"
  Resume: "${resume}"
  
  You are asked '"${question}"'. Write a response to this question:
  - It should have at most 2 paragraphs
  - Explain how your experience's translate into soft skills that align with the company and question
  - Do not lie
  - Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

const connectionRequestMsgPrompt = (resume, companyDescription, tone, recipientName) => {
  return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a message ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- It MUST BE under 300 characters
- Ask to share my resume
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

const linkedInMsgPrompt = (resume, companyDescription, tone, recipientName) => {
  return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a LinkedIn message ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- It should have at most 2 body paragraphs
- Explain how my experience's translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

const coldEmailPrompt = (resume, companyDescription, tone, recipientName) => {
  return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a cold email ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- It should have at most 2 body paragraphs
- Explain how my experience's translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

const letterOfIntentPrompt = (resume, companyDescription, tone) => {
  return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a letter of intent for this company asking for roles similar to the ones on my resume:
- It should have at most 2 body paragraphs
- Do NOT USE THE EXACT SAME PHRASING from the company description
- Explain how my experience's translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.

Start with "Dear {Company Name} Hiring Team,"`;
}

const coverLetterPrompt = (resume, jobDescription, tone) => {
  return `Below is a job description and my resume.

Job Description: "${jobDescription}"
Resume: "${resume}"

Write a cover letter for this job:
- It should have at most 2 body paragraphs
- DO NOT USE THE EXACT SAME PHRASING from the company description
- Explain how my experience's translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.

Start with "Dear {Company Name} Hiring Team,"`;
}
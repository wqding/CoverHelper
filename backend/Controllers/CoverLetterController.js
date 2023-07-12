import dotenv from 'dotenv-safe'
import { contentOptions } from '../constants.js'
import Queue from 'bull';
import { Configuration, OpenAIApi } from "openai";
import { coverLetterPrompt, letterOfIntentPrompt, coldEmailPrompt, customQuestionPrompt, linkedInMsgPrompt, connectionRequestMsgPrompt } from '../prompts.js'

dotenv.config({silent: true})

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const workers = process.env.WEB_CONCURRENCY || 2;
const maxJobsPerWorker = 50;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Connect to a named work queue
const generateQueue = new Queue('generate', REDIS_URL);

generateQueue.process(maxJobsPerWorker, async (job) => {
  const { contentType, resume, input, tone, recipientName, question } = job.data;
  try {
      let chatRes = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{"role": "user", "content": generatePrompt(contentType, resume, input, tone, recipientName, question)}],
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          frequency_penalty: 0.6,
          presence_penalty: 0.6,
      });

      // console.log(chatRes.data.choices)
  
      return Buffer.from(chatRes.data.choices[0].message.content, 'utf8').toString('base64');
  
  } catch(error) {
      if (error.response) {
        console.error(error.response.status, error.response.data);
      } else {
        console.error(`Error with api request: ${error.message}`);
      }
  }
});

export const coverLetterController = async(req,res) => {
  const { contentType, resume, input, tone, recipientName, question } = req.body;
  // TODO: prevent users from DDOSING the API
  // create job
  let job = await generateQueue.add({ contentType, resume, input, tone, recipientName, question});
  res.json({ id: job.id });
}

export const generatePrompt = (contentType, resume, input, tone, recipientName, question) => {
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
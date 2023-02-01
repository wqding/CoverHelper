import dotenv from 'dotenv-safe'
import { ChatGPTAPI } from 'chatgpt'

dotenv.config()

const chatgptAPI = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })

const resume = `Experience:
                  Customer Service Advocate (Jan 2015 to Current): Handled customer calls, resolving inquiries related to pharmacy benefits, mail order, and prescription. Escalated drug-related calls to pharmacist. Assisted with entering new prescription orders.
                  Medical Device Repair Technician (Feb 2014 to May 2014): Inspected and tested malfunctioning medical equipment. Performed preventive maintenance. Researched parts and requisitioned them.
                  Field Electronics Technician (Jan 2010 to Jan 2013): Read and interpreted schematic drawings. Assembled electrical and electronic systems. Explained assembly procedures to workers.
                  Production Team Lead (Jan 2008 to Jan 2009): Managed a team of 20+ employees by scheduling and training them. Resolved operational problems and improved work processes.
                  Customer Service Representative (Jan 2003 to Jan 2008): Handled customer questions and complaints. Made financial decisions to protect revenue. Assisted the call center manager in handling escalations.

              Education:

                  Logistics and Supply Chain Management - Post Secondary Training Certificate (2011): Florida State College at Jacksonville
                  Diploma (2003): Concorde Career Institution

              Military Service:

                  84-92 UNITED STATES ARMY Communications Specialist - Honorable Discharge

              Skills:

                  Customer service, financial, hand tools, logistics, mechanical, phone, power tools, quality, research, safety, scheduling, soldering, supply chain management, typing, wiring.
              `;
const jobDesc = `"Qualifications

                Long-Term Care Administrator Certificate (Required)

                Bachelor's Degree (Preferred)

                management: 1 year (Preferred)

            Full Job Description

            St. Joseph’s General Hospital Elliot Lake (SJGHEL), an employer of choice in Elliot Lake and the North Shore, is currently seeking a Vice President Long-Term Care and Addiction Services/Administrator (VP).

            SJGHEL is comprised of three (3) facilities and 187 beds; a 55-bed Acute Care Hospital, a 64-bed Long-Term Care Centre (The Manor), and a 68-bed Addictions Treatment Centre (The Oaks Centre). The VP is responsible for the leadership and administration of both The Manor (LTC) and The Oaks Centre (Addiction Services).

            Reporting to the CEO, this is an incredible opportunity to join the executive Senior Leadership Team (SLT) at SJGHEL. We are seeking an individual with superior leadership skills who leads with compassion and empathy in providing these two (2) critical community services located in Elliot Lake that service all communities in the North Shore region.

            The VP is also responsible for the leadership of both organizations including all Health Human Resources (HHR), planning, direction, coordination, and control of both facilities. Having direct responsibility for leading the Management Team in both facilities, this position will oversee approximately 100 employees; 70 at The Manor and 30 at The Oaks Centre.

            The VP will also lead the addition and development of 32 new LTC beds at St. Joseph’s Manor (SJM). SJGHEL serves the diverse health care needs of residents of Elliot Lake and the surrounding communities. In accordance with our Mission, Vision & Values and following catholic and Christian tradition, we strive to provide safe, compassionate and quality care.

            Required Qualifications:

            · Demonstrated excellent communication and leadership skills in a health care organization that provides services to communities

            · Successful completion of a recognized baccalaureate program in a health care related discipline. Complemented by a relevant master’s degree or post-graduate education preferred

            · Long-Term Care Administrator certification is required. Knowledge and experience with the Long-Term Care Act is essential

            · Knowledge of the Withdrawal Management and Residential Addictions Standards and applicable legislation including the Mental Health Act and Health Care Consult Act preferred

            Preferred Ability/Skills/Knowledge:

            · Knowledge of, and willingness to support SJGHEL’s Mission, Vision & Values of C*ompassion, Humility & Harmony, Respect, Integrity, Social Responsibility and T*he Sacredness of Life

            Assets:

            · Bilingualism is preferred"`;

export const generateCoverLetter = async(req,res) => {
    const resume = req.body.resume;
    const jobDesc = req.body.desc;

    // call chat gpt api 
    try {
      let res = await chatgptAPI.sendMessage(generatePrompt(resume, jobDesc),{
        onProgress: (partialResponse) => {
          // do something
          // console.log(partialResponse)
        },
        timeoutMs: 60 * 1000, // 1 min timeout
      })
      console.log(res.text)
      
      // send a follow-up
      // res = await api.sendMessage('Can you expand on that?', {
      //   conversationId: res.conversationId,
      //   parentMessageId: res.id
      // })
      // console.log(res.text)
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with ChatGPT api request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
}

// TODO: improve prompt
function generatePrompt(resume, jobDesc) {
  return `Write a cover letter for the following job description using the provided experiences, reference specific parts of the resume which match the job description. In each paragraph, paraphrase this structure: "I demonstrated {resume skill that matches job description} in {job from resume} by {example from resume}"
  resume: "${resume}"
  job description: "${jobDesc}"`;
}
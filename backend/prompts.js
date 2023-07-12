export const customQuestionPrompt = (resume, input, tone, question) => {
    return `You are a qualified job applicant applying to a job, below is a job or company description and my resume.

Company or Job Description: "${input}"
Resume: "${resume}"

You are asked '"${question}"'. Write a response to this question:
- KEEP IT SHORT
- Explain how your experiences translate into soft skills that align with the company and question
- Do not lie
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}
  
export const connectionRequestMsgPrompt = (resume, companyDescription, tone, recipientName) => {
    return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a message ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- It MUST BE under 300 characters
- Ask to share my resume
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

export const linkedInMsgPrompt = (resume, companyDescription, tone, recipientName) => {
    return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a LinkedIn message ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- KEEP IT SHORT
- Explain how my experiences translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

export const coldEmailPrompt = (resume, companyDescription, tone, recipientName) => {
    return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a cold email ${recipientName === "" ? "" : `to ${recipientName}`} asking for roles similar to the ones on my resume}:
- KEEP IT SHORT
- Explain how my experiences translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.`
}

export const letterOfIntentPrompt = (resume, companyDescription, tone) => {
    return `Below is a company description and my resume.

Company Description: "${companyDescription}"
Resume: "${resume}"

Write a letter of intent for this company asking for roles similar to the ones on my resume:
- KEEP IT SHORT
- Explain how my experiences translate into soft skills that align with the company
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.

Start with "Dear {Company Name} Hiring Team," if you know the company name.`;
}

export const coverLetterPrompt = (resume, jobDescription, tone) => {
    return `Job Description: "${jobDescription}"
Resume: "${resume}"

Write a cover letter for the job using the resume following this structure:
- Salutaion
- Introduction
- Paragraph 1: Explain how my experiences and technical skills on the resume align with the job description
- Paragraph 2: Explain how my experiences translate into soft skills that align with the company
- Closing paragraph
- Use a ${tone === 0 ? 'funny and witty' : 'professional'} tone.

Start with "Dear {Company Name} Hiring Team," if you know the company name.`;
}
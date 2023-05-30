import TextField from "@mui/material/TextField";
import { contentOptions } from "../utils/constants";

export const ContentInputSwitch = ({contentType, input, setInput, recipientName, setRecipientName, question, setQuestion}) => {
    switch (contentType.enum) {
        case contentOptions.COVER_LETTER.enum: return (
        <TextField
            label="Job Description"
            placeholder='e.g. "We are looking for a software engineer that can sing and dance."'
            multiline
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        )
        case contentOptions.LETTER_OF_INTENT.enum: return (
        <TextField
            label="Company Description (can be found on their website)"
            placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
            multiline
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        )
        case contentOptions.COLD_EMAIL.enum: return (<>
        <TextField
            label="Recipient's First Name (optional)"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
        />
        <TextField
            label="Company Description (can be found on their website)"
            placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
            multiline
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        </>)
        case contentOptions.LINKEDIN_MESSAGE.enum: return (<>
        <TextField
            label="Recipient's First Name (optional)"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
        />
        <TextField
            label="Company Description (can be found on their website)"
            placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
            multiline
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        </>)
        case contentOptions.CUSTOM_QUESTION_ANSWER.enum: return (<>
        <TextField
            label="Custom Question (e.g. why do you want to work here?)"
            multiline
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
        />
        <TextField
            label="Company/Job Description"
            placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
            multiline
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        </>)
        default: return null;
    }
}
export const contentOptions = {
    COVER_LETTER: {
        title: 'Cover Letter',
        enum: 1,
        defaultText: "Dear Hiring Manager,\n\n...",
    },
    LETTER_OF_INTENT: {
        title: 'Letter of Intent',
        enum: 2,
        defaultText: "Dear ...",
    },
    COLD_EMAIL: {
        title: 'Cold Email',
        enum: 3,
        defaultText: "Dear ...",
    },
    LINKEDIN_CONNECTION_REQUEST_MESSAGE: {
        title: 'LinkedIn Connection Request Message',
        enum: 4,
        defaultText: "Hey ...",
    },
    LINKEDIN_MESSAGE: {
        title: 'LinkedIn Message',
        enum: 5,
        defaultText: "Hey ...",
    },
    CUSTOM_QUESTION_ANSWER: {
        title: 'Custom Question Answer',
        enum: 6,
        defaultText: "I would be a good fit for this position because ...",
    },
}

export const toneOptions = [
    {
        value: 0,
        label: 'Casual',
    },
    {
        value: 50,
        label: 'Neutral',
    },
    {
        value: 100,
        label: 'Formal',
    },
]
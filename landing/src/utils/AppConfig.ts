export const AppConfig = {
  site_name: 'Cover Helper',
  title: 'CoverHelper - Best AI Cover Letter Writer',
  description:
    'Stand out to potential employers! Let CoverHelper help you write tailored cover letters, cold emails, and more to match your resume & the job description. Goodbye generic intros!',
  locale: 'en',
};

export const COVER_HELPER_URL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000/app'
    : 'https://coverhelper.live/app';

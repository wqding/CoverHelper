export const AppConfig = {
  site_name: 'Cover Helper',
  title: 'CoverHelper - Best AI Cover Letter Writer',
  description: 'Stand out to potential employers! Let CoverHelper help you write tailored cover letters, cold emails, and more to match your resume & the job description. Goodbye generic intros!',
  locale: 'en',
};

const dev = process.env.NODE_ENV !== 'production';

export const COVER_HELPER_URL = dev ? 'http://localhost:3000/app' : 'https://coverhelper.live/app'

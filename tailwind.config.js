/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F6F8FF',
        main: '#5253ea',
        hover: '#4445c6',
        customGray: 'rgb(219, 219, 219)',
      },
      margin: {
        4.5: '1.125rem',
      },
      fontFamily: {
        pretendard: [
          'Pretendard Variable',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      width: {
        body510: '510px',
      },
      maxWidth: {
        body510: '510px',
        media: '850px',
      },
      minWidth: {
        body510: '510px',
        body400: '400px'
      },
      maxHeight: {
        media: '850px',
      },
      fontSize: {
        body18sd: [
          '18px',
          {
            lineHeight: '28px',
            fontWeight: '600',
          },
        ],
        body16sd: [
          '16px',
          {
            lineHeight: '24px',
            fontWeight: '600',
          },
        ],
        body16m: [
          '16px',
          {
            lineHeight: '24px',
            fontWeight: '500',
          },
        ],
        body14sd: [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '600',
          },
        ],
        body14m: [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '500',
          },
        ],
        body14rg: [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '400',
          },
        ],
        body12sd: [
          '12px',
          {
            lineHeight: '18px',
            fontWeight: '600',
          },
        ],
        body12rg: [
          '12px',
          {
            lineHeight: '18px',
            fontWeight: '400',
          },
        ],
      },
      boxShadow: {
        modal: ' 0px 7px 14px rgba(32, 41, 42, 0.06), 0px 0px 2px rgba(32, 41, 42, 0.05);',
        helper: '0px 4px 10px rgba(32, 41, 42, 0.04), 0px 0px 1px rgba(32, 41, 42, 0.01);',
      },
    },
  },
  plugins: [],
  important: true,
}

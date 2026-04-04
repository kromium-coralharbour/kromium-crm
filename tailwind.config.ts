import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:'#0B0E1A', bg2:'#0F1422', card:'#141929', card2:'#192035',
        orange:'#F26419', orange2:'#E85A0E',
      },
      fontFamily: { outfit:['Outfit','sans-serif'], inter:['Inter','sans-serif'] },
    },
  },
  plugins: [],
}
export default config

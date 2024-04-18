// theme.js
import tw from '../tailwind.config.js';



const theme = {
  colors: {
    primary: '#4b5563',
    primaryDark: '#374151',
    secondary: '#059669',
    background: '#1f2937',
    backgroundDark: '#111827',
    text: '#e5e7eb',
    textDark: '#f9fafb',
    textMuted: '#9ca3af',
    textMutedDark: '#6b7280',
    error: '#dc2626',
    errorDark: '#f87171',
    info: '#3b82f6',
    infoDark: '#63a4ff',
    success: '#10b981',
    successDark: '#34d399',
  },
  components: {
    errorMessage: tw`text-red-500 p-2`,
    button: tw`px-6 py-2 rounded-lg shadow-md transition-colors duration-300 ease-in-out`,
    buttonPrimary: tw`bg-blue-700 text-white shadow-md hover:bg-blue-800 focus:bg-blue-800 transition-colors duration-300 ease-in-out`,
    buttonSecondary: tw`bg-gray-600 text-gray-200 shadow-md hover:bg-gray-700 focus:bg-gray-700 transition-colors duration-300 ease-in-out`,
    input: tw`bg-gray-700 text-white p-3 rounded-lg border border-gray-500 w-3/4 mb-4 focus:border-blue-400 focus:outline-none transition-all duration-200`,
    image: tw`w-full h-40 rounded-md transition-transform duration-500 ease-in-out transform hover:scale-105`,
    card: tw`bg-gray-700 p-4 rounded-lg shadow-lg mb-4 transition-all duration-300 ease-in-out`,
    header: tw`text-xl text-white font-bold mb-4`,
    subheader: tw`text-lg text-gray-200 font-semibold mb-2`,
    paragraph: tw`text-base text-gray-300 mb-4`,
    link: tw`text-blue-400 underline hover:text-blue-500 transition-colors duration-300 ease-in-out`,
    tag: tw`bg-blue-200 px-2 py-1 rounded-full m-1 transition-colors duration-300 ease-in-out hover:bg-blue-300`,
    tagIncluded: tw`bg-blue-200 text-black`,
    tagExcluded: tw`bg-gray-200 text-gray-500`,
  },
  images: {
    placeholder: require('../Assets/GamePodLogo.png'),
    logo: require('../Assets/GamePodLogo.png'),
  },
  fonts: {
    body: tw`font-sans text-base`,
    heading: tw`font-semibold text-xl`,
    subheading: tw`font-semibold text-lg`,
  },
  sizes: {
    container: tw`px-4 md:px-8`,
    button: tw`w-full md:w-1/2 py-2`,
  },
  podDisplay: {
    container: tw`flex-1 p-4`,
    image: tw`h-40 w-full transition-transform duration-500 ease-in-out transform hover:scale-105`,
    header: tw`text-xl font-bold mb-2`,
    paragraph: tw`text-base mb-2`,
    input: tw`border border-gray-300 p-2 rounded mb-2`,
    tag: tw`mt-2 p-2`,
    tagIncluded: tw`text-black`,
    tagExcluded: tw`text-gray-500 line-through`,
    buttonPrimary: tw`bg-blue-700 text-white shadow-md hover:bg-blue-800 focus:bg-blue-800 transition-colors duration-300 ease-in-out`,
    buttonSecondary: tw`bg-gray-600 text-gray-200 shadow-md hover:bg-gray-700 focus:bg-gray-700 transition-colors duration-300 ease-in-out`,
  },
};

export default theme;

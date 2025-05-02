module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
      './node_modules/flowbite/**/*.js', // Add this line
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Red Hat Text', 'sans-serif'],
                display: ['Red Hat Display', 'sans-serif'],
            },
            colors: {
                'red-hat-primary': '#EE0000',
                'red-hat-secondary': '#CC0000',
                'red-hat-gray': '#F5F5F5',
                'red-hat-dark-gray': '#1b1d21',
            },
        },
    },
    plugins: [
      require('flowbite/plugin'), // Add this line
    ],
  };
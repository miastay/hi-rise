const config = {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  
    plugins: [require('flowbite/plugin')],
  
    darkMode: 'media',
  
    theme: {
      extend: {
        colors: {
          // flowbite-svelte
            primary: {
                "50":"#eef2ff",
                "100":"#e0e7ff",
                "200":"#c7d2fe",
                "300":"#a5b4fc",
                "400":"#818cf8",
                "500":"#6366f1",
                "600":"#4f46e5",
                "700":"#4338ca",
                "800":"#3730a3",
                "900":"#312e81"
            },
            gray: {
                50: "#f0f0f5",
                100: '#cdd0d9',
                200: '#acafbe',
                300: '#8b8ea3',
                400: '#6a6d88',
                500: '#494C6D',
                600: '#3e3f5b',
                700: '#313248',
                800: "#242535",
                900: "#171822"
            }
        }
      }
    }
  };
  
module.exports = config;
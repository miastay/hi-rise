const config = {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  
    plugins: [require('flowbite/plugin')],
  
    darkMode: 'media',
  
    theme: {
      extend: {
        colors: {
          // flowbite-svelte
            primary: {
                "50":"#e7e5ff",
                "100":"#bebcff",
                "200":"#9692ff",
                "300":"#6e68ff",
                "400":"#463eff",
                "500":"#1e14ff",
                "600":"#1910d2",
                "700":"#130ca4",
                "800":"#0d0876",
                "900":"#070448",
                "950":"#01001a"
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
            },
            green: {"50":"#f0fdf4","100":"#dcfce7","200":"#bbf7d0","300":"#86efac","400":"#4ade80","500":"#22c55e","600":"#16a34a","700":"#15803d","800":"#166534","900":"#14532d"}
        }
      }
    }
  };
  
module.exports = config;
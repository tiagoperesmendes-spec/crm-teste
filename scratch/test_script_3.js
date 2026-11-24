
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              DEFAULT: '#6C1C37',
              primary: '#6C1C37',
              hover: '#B45A69',
              tint: '#E6C5CA',
              accent: '#CDBA7B',
            },
            app: {
              bg: '#EDE6DE',
              surface: '#FFFFFF',
              warm: '#FBF9F6',
              hover: '#F6F2EC',
              border: '#E4DDD3',
              text: '#1A1A1A',
              muted: '#6B6B6B',
              'muted-bg': '#5C554E',
            }
          },
          fontFamily: {
            title: ['"Hanken Grotesk"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            sans: ['"Google Sans"', '"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    };
  
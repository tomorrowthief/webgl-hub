import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Fix: Changed crossOrigin="true" to crossOrigin="" which is a valid value for the CrossOrigin type. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    fontFamily: {
                      sans: ['Inter', 'sans-serif'],
                      mono: ['Roboto Mono', 'monospace'],
                    },
                    colors: {
                      'navy': {
                        '50': '#f0f4fa',
                        '100': '#e0eaf6',
                        '200': '#c4d8ee',
                        '300': '#a0bee2',
                        '400': '#7d9fd3',
                        '500': '#6183c2',
                        '600': '#4d6aaf',
                        '700': '#3f5799',
                        '800': '#35487c',
                        '900': '#2e3d65',
                        '950': '#1c253f',
                      },
                    }
                  }
                }
              }
            `,
          }}
        />
      </Head>
      <body className="bg-navy-950 text-navy-200 font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

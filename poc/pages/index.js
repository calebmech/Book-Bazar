import Head from 'next/head';
import CreatePostingWizard from '../src/createPostingWizard.tsx';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Book Bazaar</title>
      </Head>

      <main>
        <content>
          <h1>
            Create Used Book Posting
          </h1>

          <CreatePostingWizard />
        </content>
      </main>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        main {
          width: 500px;
          margin: 0 auto;
          padding: 18px;
        }

        p {
          text-align: justify;
        }

        #scanner-container {
          position: relative;
        }

        .drawingBuffer {
          position: absolute;
          left: 0;
          top: 0;
        }
      `}</style>
    </div>
  )
}

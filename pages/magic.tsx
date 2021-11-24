import { createSessionCookie } from '@lib/helpers/backend/session-cookie';
import { consumeMagicLink } from '@lib/services/magic';
import { StatusCodes } from 'http-status-codes';
import { GetServerSideProps, NextPage } from 'next';

interface MagicProps {
  errorMessage: string;
}

/**
 * Displays an error message if magic link consumption fails.
 *
 * WIP
 */
const Magic: NextPage<MagicProps> = ({ errorMessage }) => {
  return <p>{errorMessage}</p>;
};

/**
 * Consumes a magic link and redirects to the base URL.
 *
 * If consumption fails, an error message is returned instead.
 */
export const getServerSideProps: GetServerSideProps<MagicProps> = async ({ res, query }) => {
  const { token } = query;

  if (typeof token !== 'string') {
    res.statusCode = StatusCodes.BAD_REQUEST;
    return {
      props: {
        errorMessage: 'Invalid login link.',
      },
    };
  }

  const sessionToken = await consumeMagicLink(token);

  if (!sessionToken) {
    res.statusCode = StatusCodes.UNAUTHORIZED;
    return {
      props: {
        errorMessage: 'This login link is invalid and may have expired or already been used.',
      },
    };
  }

  res.setHeader('Set-Cookie', createSessionCookie(sessionToken.token, sessionToken.expirationDate));

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default Magic;

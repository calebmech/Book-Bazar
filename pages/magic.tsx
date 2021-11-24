import { createSessionCookie } from '@lib/helpers/backend/session-cookie';
import { consumeMagicLink } from '@lib/services/magic';
import { StatusCodes } from 'http-status-codes';
import { GetServerSideProps, NextPage } from 'next';

interface MagicProps {
  message: string;
}

const Magic: NextPage<MagicProps> = ({ message }) => {
  return <p>{message}</p>;
};

export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
  const { token } = query;

  if (typeof token !== 'string') {
    res.statusCode = StatusCodes.BAD_REQUEST;
    return {
      props: {
        message: 'Invalid URL',
      },
    };
  }

  const sessionToken = await consumeMagicLink(token);

  if (!sessionToken) {
    res.statusCode = StatusCodes.UNAUTHORIZED;
    return {
      props: {
        message: 'Invalid token',
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

import { createDeleteSessionCookie, SESSION_TOKEN_COOKIE } from '@lib/helpers/backend/session-cookie';
import { deleteSession } from '@lib/services/session';
import { GetServerSideProps, NextPage } from 'next';

const Logout: NextPage = () => <></>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = req.cookies[SESSION_TOKEN_COOKIE];

  await deleteSession(token);

  res.setHeader('Set-Cookie', createDeleteSessionCookie());

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default Logout;

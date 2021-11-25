import { User } from '.prisma/client';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useMutation, useQuery, UseQueryResult } from 'react-query';

export function useUserQuery(): UseQueryResult<User> {
  return useQuery('user', () => axios.get<User>('api/user').then((res) => res.data));
}

export function useSendMagicLinkMutation() {
  return useMutation((macID: string) => axios.post('/api/auth/magic', { macID }));
}

export function useLogout() {
  const router = useRouter();
  const mutation = useMutation(() => axios.post('/api/auth/logout'));

  useEffect(() => {
    if (mutation.isSuccess) {
      router.reload();
    }
  }, [router, mutation.isSuccess]);

  return mutation.mutate;
}

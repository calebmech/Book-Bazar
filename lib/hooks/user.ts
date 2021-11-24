import { User } from '.prisma/client';
import axios from 'axios';
import { useMutation, useQuery, UseQueryResult } from 'react-query';

export function useUserQuery(): UseQueryResult<User> {
  return useQuery('user', () => axios.get<User>('api/user').then((res) => res.data));
}

export function useSendMagicLinkMutation() {
  return useMutation((macID: string) => axios.post('/api/auth/magic', { macID }));
}

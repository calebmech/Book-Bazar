import { ToastId, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { SendMagicLinkBody } from "pages/api/auth/magic";
import { GetCurrentUserResponse } from "pages/api/user";
import { UpdateUserRequest } from "pages/api/user/[id]";
import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const USER_KEY = "user";

export type User = GetCurrentUserResponse;

export function useUserQuery() {
  const query = useQuery(USER_KEY, () =>
    axios.get<User>("/api/user").then((res) => res.data)
  );

  return {
    ...query,
    user: query.data,
    isAuthenticated: Boolean(query.data),
  };
}

export interface UpdateUserMutationProps {
  id: User["id"];
  updateUserRequest: UpdateUserRequest & {
    image?: Blob;
  };
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  return useMutation<User, unknown, UpdateUserMutationProps>(
    ({ id, updateUserRequest }) => {
      const data = new FormData();
      if (updateUserRequest.name) {
        data.append("name", updateUserRequest.name);
      }
      if (updateUserRequest.image) {
        data.append("image", updateUserRequest.image);
      }
      return axios.put("/api/user/" + id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_KEY);
      },
      onError: () => {
        toastIdRef.current = toast({
          title: "Update failed",
          description:
            "An error occurred while updating your account, please try again later.",
          status: "error",
          isClosable: true,
        });
      },
      onMutate: () => {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current);
        }
      },
    }
  );
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation((id: string) => axios.delete("/api/user/" + id), {
    onSuccess: () => {
      queryClient.invalidateQueries(USER_KEY);
      router.push("/");
    },
  });
}

export function useSendMagicLinkMutation() {
  return useMutation((request: SendMagicLinkBody) =>
    axios.post("/api/auth/magic", request)
  );
}

export function useLogout() {
  const mutation = useMutation(() => axios.post("/api/auth/logout"));

  useEffect(() => {
    if (mutation.isSuccess) {
      location.assign("/");
    }
  }, [mutation.isSuccess]);

  return mutation.mutate;
}

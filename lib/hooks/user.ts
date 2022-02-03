import { ToastId, useToast } from "@chakra-ui/react";
import { ResponseObject } from "@lib/helpers/type-utilities";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { GetCurrentUserResponse } from "pages/api/user";
import { UpdateUserRequest } from "pages/api/user/[id]";
import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const USER_KEY = "user";

export type User = GetCurrentUserResponse;

export function useUserQuery(initialData?: User) {
  const query = useQuery(
    USER_KEY,
    () => axios.get<User>("api/user").then((res) => res.data),
    { initialData }
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
  return useMutation((macID: string) =>
    axios.post("/api/auth/magic", { macID })
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

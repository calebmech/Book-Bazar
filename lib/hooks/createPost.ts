import { useToast } from "@chakra-ui/react";
import { PostWithBookWithUser } from "@lib/services/post";
import axios from "axios";
import { useMutation } from "react-query";

export interface CreatablePostClient {
  price: number;
  description: string;
  image: Blob;
  bookId: string;
}

export function useCreatePostMutation() {
  const toast = useToast();

  return useMutation(
    async (creatablePost: CreatablePostClient) => {
      const formData = new FormData();
      formData.append("price", creatablePost.price.toFixed(2).replace(".", ""));
      formData.append("description", creatablePost.description);
      formData.append("image", creatablePost.image);
      formData.append("bookId", creatablePost.bookId);
      const res = await axios.post<PostWithBookWithUser>("/api/post", formData);
      return res.data;
    },
    {
      onError: () => {
        toast({
          title: "Something went wrong when creating your post. ",
          description: "Please try again later.",
          status: "error",
          isClosable: true,
        });
      },
    }
  );
}

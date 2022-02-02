import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { User, useUpdateUserMutation } from "@lib/hooks/user";
import { FormEvent, useState } from "react";

export default function UpdateNameForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || "");

  const mutation = useUpdateUserMutation();

  const handleNameSubmit = (event: FormEvent) => {
    mutation.mutate({
      id: user.id,
      updateUserRequest: { name: name.trim() },
    });
    event.preventDefault();
  };

  return (
    <form onSubmit={handleNameSubmit} style={{ flex: "auto" }}>
      <HStack width="100%">
        <FormControl>
          <FormLabel htmlFor="name">Full name</FormLabel>
          <HStack>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              width="auto"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button
              type="submit"
              disabled={name.trim().length === 0}
              isLoading={mutation.isLoading}
            >
              Update
            </Button>
          </HStack>
          <FormHelperText>
            This will be displayed on posts you make
          </FormHelperText>
        </FormControl>
      </HStack>
    </form>
  );
}

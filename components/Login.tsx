import { FormEvent } from "react";
import useRandomMacID from "@lib/hooks/useRandomMacID";
import { useSendMagicLinkMutation } from "@lib/hooks/user";

export default function Login() {
  const macIDPlaceholder = useRandomMacID();
  const mutation = useSendMagicLinkMutation();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const macID = formData.get("macID");
    if (typeof macID === "string") {
      mutation.mutate(macID);
    }
  };

  switch (mutation.status) {
    case "loading":
      return <p>Loading...</p>;
    case "success":
      return <p>Check your email!</p>;
    case "error":
      return <p>Something went wrong, please try again later.</p>;
    case "idle":
      return (
        <form onSubmit={handleSubmit}>
          <p>
            <label>
              <input
                type="text"
                name="macID"
                required
                placeholder={macIDPlaceholder}
              />
              @mcmaster.ca
            </label>
          </p>
          <input type="submit" value="Login" />
        </form>
      );
  }
}

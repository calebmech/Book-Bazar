import { Router } from "next/router";
import { useRef, useState } from "react";

export default function useIsLoading(debounceTime = 150) {
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef(0);

  Router.events.on("routeChangeStart", () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => setIsLoading(true),
      debounceTime
    );
  });

  Router.events.on("routeChangeComplete", () => {
    clearTimeout(timeoutRef.current);
    setIsLoading(false);
  });

  return isLoading;
}

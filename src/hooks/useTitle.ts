import { useEffect } from "react";

export default function useTitle(suffix: string) {
  useEffect(() => {
    const baseTitle = "Parentingo";

    document.title = `${baseTitle} - ${suffix}`;

    return () => {
      document.title = baseTitle;
    };

  }, [suffix]);
}

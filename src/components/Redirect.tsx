import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  path: string;
}

export default function Redirect({ path }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(path);
  }, []);

  return null;
}

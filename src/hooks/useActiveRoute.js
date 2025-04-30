import { useLocation } from "react-router-dom";

export default function useActiveRoute() {
  const location = useLocation();
  return location.pathname;
}

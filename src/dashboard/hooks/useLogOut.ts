import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

export const useLogOut = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const navigate = useNavigate();
  return useCallback(async () => {
    await api(`/api/user/logout`, {
      method: "POST",
    });
    await navigate({ to: "/login" });
  }, [queryClient, api]);
};

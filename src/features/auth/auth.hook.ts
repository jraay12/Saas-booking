import { useMutation } from "@tanstack/react-query";

import { register, login } from "./auth.api";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

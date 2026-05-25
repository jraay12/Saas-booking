import { useMutation } from "@tanstack/react-query";

import { register } from "./auth.api";

export const useRegister = () => {

  return useMutation({
    mutationFn: register,
  });
};

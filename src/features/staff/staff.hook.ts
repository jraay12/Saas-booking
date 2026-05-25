import { createStaff } from "./staff.api";
import { useMutation } from "@tanstack/react-query";

export const useCreateStaff = () => {
  return useMutation({
    mutationFn: createStaff,
  });
};
export const convertTo12Hours = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date(1970, 0, 1, hours, minutes);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMutualFollowers = (userId) => {
  return useQuery({
    queryKey: ["mutual-followers", userId],
    queryFn: async () => {
      const res = await axios.get("/api/follows/mutual", {
        params: { userId },
      });
      return res.data; // danh sách [{ id, username, fullName, avatarUrl }]
    },
    enabled: !!userId,
  });
};

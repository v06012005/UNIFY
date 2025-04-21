// hooks/useSuggestedUsers.js
import { useQuery } from "@tanstack/react-query";
import {
  getMyInfo,
  getSuggestedUsers,
  getFollowerUsers,
  getFollowingUsers,
  getFriendUsers,
} from "@/lib/api/user";

export const useUserInfo = () =>
  useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 5,
  });

export const useSuggestedUsers = (userId) =>
  useQuery({
    queryKey: ["suggestedUsers", userId],
    queryFn: () => fetchSuggestedUsers(userId),
    enabled: !!userId,
  });

export const useFollowerUsers = (userId) =>
  useQuery({
    queryKey: ["followerUsers", userId],
    queryFn: () => fetchFollowerUsers(userId),
    enabled: !!userId,
  });

export const useFollowingUsers = (userId) =>
  useQuery({
    queryKey: ["followingUsers", userId],
    queryFn: () => fetchFollowingUsers(userId),
    enabled: !!userId,
  });

export const useFriendUsers = (userId) =>
  useQuery({
    queryKey: ["friendUsers", userId],
    queryFn: () => fetchFriendUsers(userId),
    enabled: !!userId,
  });

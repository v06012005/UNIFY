import { useQuery } from "@tanstack/react-query";
import {
  getMyInfo,
  getSuggestedUsers,
  getFollowerUsers,
  getFollowingUsers,
  getFriendUsers,
} from "@/app/api/user";

export const useUserInfo = () =>
  useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    staleTime: 1000 * 60 * 5,
  });

export const useSuggestedUsers = (userId) =>
  useQuery({
    queryKey: ["suggestedUsers", userId],
    queryFn: () => getSuggestedUsers(userId),
    enabled: !!userId,
    // refetchInterval: 10000,
    // refetchIntervalInBackground: true,
  });

export const useFollowerUsers = (userId) =>
  useQuery({
    queryKey: ["followerUsers", userId],
    queryFn: () => getFollowerUsers(userId),
    enabled: !!userId,
    // refetchInterval: 10000,
    // refetchIntervalInBackground: true,
  });

export const useFollowingUsers = (userId) =>
  useQuery({
    queryKey: ["followingUsers", userId],
    queryFn: () => getFollowingUsers(userId),
    enabled: !!userId,
    // refetchInterval: 10000,
    // refetchIntervalInBackground: true,
  });

export const useFriendUsers = (userId) =>
  useQuery({
    queryKey: ["friendUsers", userId],
    queryFn: () => getFriendUsers(userId),
    enabled: !!userId,
  });

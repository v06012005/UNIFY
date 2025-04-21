import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLikeStatus, getLikeCount } from "@/lib/api/services/likeService";

const usePostLikeStatus = (userId, postId) => {
  const queryClient = useQueryClient();

  // Fetch like status
  const { data: isLiked = false, isLoading: isLoadingLikeStatus } = useQuery({
    queryKey: ["likeStatus", userId, postId],
    queryFn: () => getLikeStatus(userId, postId),
    enabled: !!userId && !!postId, // Only fetch if userId and postId are provided
  });

  // Fetch like count
  const { data: likeCount = 0, isLoading: isLoadingLikeCount } = useQuery({
    queryKey: ["likeCount", postId],
    queryFn: () => getLikeCount(postId),
    enabled: !!postId, // Only fetch if postId is provided
  });

  // Optimistic updates for like status
  const setIsLiked = (newIsLiked) => {
    queryClient.setQueryData(["likeStatus", userId, postId], newIsLiked);
  };

  // Optimistic updates for like count
  const setLikeCount = (newLikeCount) => {
    queryClient.setQueryData(["likeCount", postId], newLikeCount);
  };

  return {
    isLiked,
    setIsLiked,
    likeCount,
    setLikeCount,
    loading: isLoadingLikeStatus || isLoadingLikeCount,
  };
};

export default usePostLikeStatus;

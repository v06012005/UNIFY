"use client";

import { Button } from "@heroui/react";
import { useEffect } from "react";
import { useFollow } from "@/components/provider/FollowProvider";

const FollowButton = ({
  userId,
  followingId,
  classFollowing = "",
  classFollow = "",
}) => {
  const { followingStatus, checkFollowing, toggleFollow } = useFollow();

  useEffect(() => {
    checkFollowing(userId, followingId);
  }, [userId, followingId]);

  const follow = followingStatus[followingId] || false;

  return (
    <Button
      onPress={() => toggleFollow(userId, followingId, follow)}
      className={follow ? classFollowing : classFollow}
    >
      <span>{follow ? "Unfollow" : "Follow"}</span>
    </Button>
  );
};

export default FollowButton;

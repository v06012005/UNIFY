"use client";

import { useEffect } from "react";
import { useFollow } from "@/components/provider/FollowProvider";

const FollowButton = ({
  userId,
  followingId,
  classFollowing = "",
  classFollow = "",
  contentFollowing = "",
  contentFollow = "",
}) => {
  const { followingStatus, checkFollowing, toggleFollow } = useFollow();

  useEffect(() => {
    checkFollowing(userId, followingId);
  }, [userId, followingId]);

  const follow = followingStatus[followingId] || false;

  return (
    <button
      onClick={() => toggleFollow(userId, followingId, follow)}
      className={follow ? classFollowing : classFollow}
    >
      <span>{follow ? contentFollowing : contentFollow}</span>
    </button>
  );
};

export default FollowButton;

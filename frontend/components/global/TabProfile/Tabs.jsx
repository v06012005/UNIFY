import UserPosts from "@/components/global/TabProfile/PostTab";
import UserReels from "@/components/global/TabProfile/ReelTab";
import SavedItems from "@/components/global/TabProfile/SavedTab";
import TaggedPosts from "@/components/global/TabProfile/TaggedTab";

const ProfileTabs = ({
  activeTab,
  userPosts,
  userReels,
  savedItems,
  taggedPosts,
}) => {
  return (
    <div className="mt-4">
      {activeTab === "post" && <UserPosts posts={userPosts} />}
      {activeTab === "reel" && <UserReels reels={userReels} />}
      {activeTab === "saved" && <SavedItems items={savedItems} />}
      {activeTab === "tagged" && <TaggedPosts taggedPosts={taggedPosts} />}
    </div>
  );
};

export default ProfileTabs;

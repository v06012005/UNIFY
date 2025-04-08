import UserPosts from "@/components/global/TabProfile/PostTab";
import UserReels from "@/components/global/TabProfile/ReelTab";
import SavedItems from "@/components/global/TabProfile/SavedTab";
import TaggedPosts from "@/components/global/TabProfile/TaggedTab";
import PostIsPrivate from "@/components/global/TabProfile/PostIsPrivate";

const ProfileTabs = ({ activeTab, username, savedItems, taggedPosts }) => {

  return (
    <div className="mt-4">
      {activeTab === "post" && <UserPosts username={username}/>}
      {activeTab === "postIsPrivate" && <PostIsPrivate username={username}/>}
      {activeTab === "reel" && <UserReels username={username} />}
      {activeTab === "saved" && <SavedItems items={savedItems} />}
      {activeTab === "tagged" && <TaggedPosts taggedPosts={taggedPosts} />}
    </div>
  );
};

export default ProfileTabs;

import Image from 'next/image';
import Link from 'next/link';

const FollowingModal = ({ isOpen, onClose, isFollow, toggleFollow }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[36%] p-6">
        <div className="flex justify-between mb-4 text-2xl">
          <h2 className="text-lg font-bold dark:text-white">Following</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Search ..."
          className="w-full border rounded-full px-4 py-1 mb-4 dark:bg-black dark:border-gray-600"
        />
        <ul>
          <li className="flex items-center justify-between py-2 border-b border-gray-500">
            <div className="flex items-center">
              <Image
                src={`/images/avt.jpg`}
                alt="Avatar"
                className="mx-auto rounded-full border-2 border-gray-300"
                width={50}
                height={50}
              />
              <span className="font-medium ml-3">TanVinh</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/messages">
                <div className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer">
                  <i className="fa-brands fa-facebook-messenger mr-2" />
                  <span>Message</span>
                </div>
              </Link>
              <div
                className="flex items-center space-x-2 border px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 dark:bg-gray-700 cursor-pointer"
                onClick={toggleFollow}
              >
                <i className={isFollow ? 'fa-solid fa-check mr-2' : 'fa-solid fa-x mr-2'} />
                <span>{isFollow ? 'Unfollow' : 'Follow'}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FollowingModal;

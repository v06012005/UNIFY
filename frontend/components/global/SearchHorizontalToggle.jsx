import {Input} from "@/components/ui/input";
import avartar from "@/public/images/GoogleLogo.png";
import {Search} from "lucide-react";
import UserHistorySearch from "@/components/global/UserHistorySearch";
import TextSearchHistory from "@/components/global/TextSearchHistory";

const SearchHorizontalToggle = ({children, isOpen, searchComponentRef}) => {


    const userSearchHistories = [
        {
            id: 1,
            username: 'user123',
            avatar: avartar,
            profile: 'Nguyễn Văn A',
            followers: 12
        },
        {
            id: 2,
            username: 'user123',
            avatar: avartar,
            profile: 'Nguyễn Văn A',
            followers: 12
        }
    ]

    return (

        <div>
            <div className={`flex items-center relative w-full h-screen`}>
                <div>
                    {children}
                </div>
                <div
                    ref={searchComponentRef}
                    className={`absolute rounded-r-lg z-50 overflow-hidden ${isOpen && 'animate-fadeScale shadow-right-left'} ${!isOpen && 'animate-fadeOut'}  h-screen bg-white left-full transition-all ease-in-out duration-300`}
                    style={{width: !isOpen ? 0 : 400}}>
                    <div className={`mx-4 my-4`}>
                        <h1 className={`text-2xl font-bold`}>Search</h1>
                        <div className={`relative`}>
                            <Input type={`search`}
                                   className={`mt-3 relative border-black text-black placeholder-black pl-10`}
                                   placeholder={"Search"}/>
                            <Search className={`absolute top-1/2 -translate-y-1/2 left-2`} color={`gray`}/>
                        </div>
                    </div>
                    <hr/>
                    <div className={`mb-3 mt-8 mx-5 grid gap-7`}>
                        {
                            userSearchHistories.map(userSearch => <UserHistorySearch key={userSearch.id}
                                                                                          avatar={userSearch.avatar}
                                                                                          username={userSearch.username}
                                                                                          profile={userSearch.profile}
                                                                                          followers={userSearch.followers}
                            />)
                        }
                        <TextSearchHistory text={'nguyenvana'}/>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SearchHorizontalToggle;
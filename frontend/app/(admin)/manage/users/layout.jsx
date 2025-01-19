import React from 'react'
import UserSidebar from './components/UserSidebar'

const layout = ({ children }) => {
    return (
        < div className='flex w-60'>
            <div className=''>
                {/* <UserSidebar /> */}
            </div >
            <div className=''>{children}</div>
        </div>
    )
}

export default layout
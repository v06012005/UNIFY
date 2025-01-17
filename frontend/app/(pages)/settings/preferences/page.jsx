import ToggleButton from '@/components/global/ToggleButton'
import React from 'react'

const page = () => {
    return (
        <div className='w-full py-3 px-10'>
            <h1 className='text-3xl font-bold mb-5'>Preferences</h1>
            <div className='my-5'>
                <p className='text-xl font-bold'>App theme</p>
                <p className='text-gray-500'>Set how your app should look like with your prefered theme.</p>
                <div className='my-2'>
                    <ToggleButton description={"Dark Mode"} />
                </div>
            </div>
            <div className='my-5'>
                <p className='text-xl font-bold'>Prefered language</p>
                <p className='text-gray-500'>See all texts, messages, titles in your prefered language.</p>
                <div className='my-2'>
                    <ToggleButton description={"Dark Mode"} />
                </div>
            </div>
        </div>
    )
}

export default page
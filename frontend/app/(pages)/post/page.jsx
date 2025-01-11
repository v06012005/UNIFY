import avatar from '@/public/images/test1.png'
import Image from 'next/image'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import SimpleTextEditor from '@/components/global/SimpleTextEditor'
import ToggleButton from '@/components/global/ToggleButton'

const User = () => {
    return (
        <div className='flex mb-4 w-full my-auto'>
            <Image src={avatar} alt='Avatar' className='rounded-full w-14 h-14' />
            <div className="ml-5">
                <p className='my-auto text-lg font-bold'>@username</p>
                <p className="my-auto">Johnny Dang</p>
            </div>
        </div>
    )
}

const Page = () => {
    return (
        <div className='h-screen'>
            <div className='flex flex-col h-full px-4'>
                <div className='grid grid-cols-2'>
                    <h1 className='font-bold text-4xl border rounded-md w-fit p-2 my-4 mx-3 bg-black text-white'>POST</h1>
                    <User />
                </div>

                <div className='flex h-full border-t'>
                    <div className='basis-1/2 p-3'>
                        <div className="h-full">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                                Photos or/and videos
                            </label>
                            <div className="mt-2 h-5/6 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                                    <div className="mt-4 flex text-sm/6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload photos or/and videos here</span>
                                            <input id="file-upload" multiple name="file-upload" type="file" className="sr-only" />
                                        </label>
                                    </div>
                                    <p className="text-xs/5 text-gray-600">PHOTOS AND VIDEOS</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <button type="button" className="text-sm/6 font-semibold text-gray-900">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className='basis-1/2 border-l p-3 overflow-y-scroll no-scrollbar'>
                        <div>
                            <p className="text-sm/6 font-medium text-gray-900">Write Your Caption</p>
                            <textarea name="caption" style={{ resize: 'none' }} id="caption" placeholder='Write your caption here...' className='w-full p-2 border rounded-md mt-2' cols="30" rows="9"></textarea>
                        </div>
                        <div>
                            <p className="text-sm/6 font-medium text-gray-900 mb-2">Who can see your post?</p>
                            <select className='border w-full pl-3 py-2 rounded-md' name="audience" id="audience">
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <div>
                            <p className="text-sm/6 font-medium text-gray-900 my-2">Advanced Settings</p>
                            <div>
                                <ToggleButton className='text-md' description={`Hide like and comment counts on this post`} />
                                <ToggleButton className='text-md' description={`Turn off commenting`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
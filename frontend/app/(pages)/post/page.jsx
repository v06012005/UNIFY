import avatar from '@/public/images/test1.png'
import Image from 'next/image'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import SimpleTextEditor from '@/components/global/SimpleTextEditor'

const User = () => {
    return (
        <div className='flex mb-4 w-full'>
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
        <div className='h-full'>
            <h1 className='font-bold text-4xl border rounded-md w-fit p-2 my-4 ml-3 bg-black text-white'>POST</h1>
            <div className='flex flex-col h-full px-4'>
                <User />
                <div className='flex h-full'>
                    <div className='basis-1/2 border p-3'>
                        <div className=" h-80">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                                Photos or/and videos
                            </label>
                            <div className="mt-2 h-full flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
                        </div>
                    </div>
                    <div className='basis-1/2 border p-3'>
                        <p className="text-sm/6 font-medium text-gray-900">Write Your Caption</p>
                        <textarea name="caption" style={{ resize: 'none' }} id="caption" placeholder='Write your caption here...' className='w-full p-2 border rounded-md mt-2' cols="30" rows="9"></textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
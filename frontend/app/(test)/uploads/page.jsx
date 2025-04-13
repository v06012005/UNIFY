// 'use client'

// import { useState } from "react";
// import { FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaFileAudio, FaFileAlt } from "react-icons/fa";

// const MAX_FILE_SIZE_MB = 50;
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// const fileIcons = {
//     "application/pdf": <FaFilePdf className="text-red-500 text-4xl" />,
//     "application/msword": <FaFileWord className="text-blue-500 text-4xl" />,
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <FaFileWord className="text-blue-500 text-4xl" />,
//     "application/vnd.ms-excel": <FaFileExcel className="text-green-500 text-4xl" />,
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FaFileExcel className="text-green-500 text-4xl" />,
//     "application/zip": <FaFileArchive className="text-yellow-500 text-4xl" />,
//     "application/x-rar-compressed": <FaFileArchive className="text-yellow-500 text-4xl" />,
//     "audio/mpeg": <FaFileAudio className="text-purple-500 text-4xl" />,
//     "audio/wav": <FaFileAudio className="text-purple-500 text-4xl" />,
//     "text/plain": <FaFileAlt className="text-gray-500 text-4xl" />,
// };

// const ChatFileUpload = () => {
//     const [files, setFiles] = useState([]);
//     const [message, setMessage] = useState("");

//     const handleFileChange = (event) => {
//         const newFiles = Array.from(event.target.files);
//         const validFiles = [];

//         newFiles.forEach((file) => {
//             if (file.size <= MAX_FILE_SIZE_BYTES) {
//                 validFiles.push({
//                     file,
//                     preview: file.type.startsWith("image/") || file.type.startsWith("video/")
//                         ? URL.createObjectURL(file)
//                         : null,
//                 });
//             } else {
//                 alert(`${file.name} exceeds 50MB and was not added.`);
//             }
//         });

//         setFiles((prevFiles) => [...prevFiles, ...validFiles]);
//     };

//     const handleRemoveFile = (index) => {
//         setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     };

//     const handlePreview = (fileObj) => {
//         if (fileObj.preview) {
//             window.open(fileObj.preview, "_blank");
//         } else {
//             alert("No preview available for this file.");
//         }
//     };

//     const handleSend = () => {
//         if (!message && files.length === 0) return alert("Nothing to send!");

//         alert(`Sending message: "${message}" with ${files.length} file(s)`);
//         setMessage("");
//         setFiles([]);
//     };

//     return (
//         <div className="flex flex-col w-full max-w-md bg-gray-900 text-white p-4 rounded-lg gap-3">
//             {/* Chat Input & File Button */}

//             {/* File Preview with Scrollable Horizontal List */}
//             {files.length > 0 && (
//                 <div className="mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 bg-gray-800 rounded-lg">
//                     <div className="flex gap-2">
//                         {files.map((fileObj, index) => (
//                             <div key={index} className="relative flex-shrink-0 w-16 h-16 cursor-pointer" onClick={() => handlePreview(fileObj)}>
//                                 {fileObj.preview && fileObj.file.type.startsWith("image/") ? (
//                                     <img src={fileObj.preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
//                                 ) : fileObj.preview && fileObj.file.type.startsWith("video/") ? (
//                                     <video src={fileObj.preview} className="w-16 h-16 rounded-lg" />
//                                 ) : fileIcons[fileObj.file.type] ? (
//                                     <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-lg">
//                                         {fileIcons[fileObj.file.type]}
//                                     </div>
//                                 ) : (
//                                     <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-lg text-sm">
//                                         📄
//                                     </div>
//                                 )}
//                                 <button
//                                     onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
//                                     className="absolute top-0 right-0 bg-transparent text-white rounded-full p-1 text-xs"
//                                 >
//                                     ❌
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <div className="flex items-center gap-2">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 bg-gray-800 p-2 rounded-lg outline-none"
//                 />
//                 <input
//                     type="file"
//                     id="chatFileInput"
//                     className="hidden"
//                     multiple
//                     accept="*/*"
//                     onChange={handleFileChange}
//                 />
//                 <button
//                     onClick={() => document.getElementById("chatFileInput").click()}
//                     className="bg-blue-500 p-2 rounded-lg"
//                 >
//                     📎
//                 </button>
//             </div>

//             {/* Send Button */}
//             <button
//                 onClick={handleSend}
//                 className="mt-3 bg-green-500 p-2 rounded-lg w-full"
//             >
//                 📤 Send
//             </button>
//         </div>
//     );
// };

// export default ChatFileUpload;


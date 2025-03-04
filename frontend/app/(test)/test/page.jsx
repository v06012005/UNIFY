"use client";

import { useState } from "react";
import { supabase } from "@/supbaseConfig";
import { v4 as uuidv4 } from "uuid";

export default function FileUploader() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const uploadFile = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setUploading(true);
        const fileName = `${uuidv4()}/${file.name}`;

        const { data, error } = await supabase.storage
            .from("files") // Change 'uploads' to your bucket name
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
            });

        setUploading(false);

        if (error) {
            console.error("Upload failed:", error.message);
            alert("Upload failed! Check console for details.");
        } else {
            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${fileName}`;
            setFileUrl(publicUrl);
            alert("Upload successful!");
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadFile} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {fileUrl && (
                <div>
                    <p>File uploaded:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {fileUrl}
                    </a>
                </div>
            )}
        </div>
    );
}

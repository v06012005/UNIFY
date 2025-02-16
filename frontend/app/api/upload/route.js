import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
    const formData = await req.formData();
    const files = formData.getAll("files"); // Get all selected files

    if (!files || files.length === 0) {
        return Response.json({ error: "No files provided" }, { status: 400 });
    }

    try {
        const uploadPromises = files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "uploads" },
                    (error, result) => {
                        if (error) reject(error);
                        else {
                            const fileType = result.format; // File extension (e.g., jpg, png, mp4)
                            const fileSize = result.bytes; // File size in bytes
                            const mediaType = result.resource_type;

                            resolve({
                                url: result.secure_url,
                                file_type: fileType,
                                size: fileSize,
                                media_type: mediaType,
                            });
                        }
                    }
                ).end(buffer);
            });
        });

        const uploadedFiles = await Promise.all(uploadPromises); // Upload all files
        return Response.json({ files: uploadedFiles });
    } catch (error) {
        return Response.json({ error: "Upload failed" }, { status: 500 });
    }
}

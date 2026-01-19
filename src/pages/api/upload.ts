
import type { APIRoute } from "astro";
import cloudinary from "../../lib/cloudinary";

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
        }

        // Convert File to Buffer/ArrayBuffer for Cloudinary upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine resource type and format based on MIME type
        const isImage = file.type.startsWith('image/');
        const resourceType = isImage ? 'image' : 'auto';

        // Force format for images to match MIME type (Trust Browser over Cloudinary detection)
        // This prevents Cloudinary from erroneously tagging JPEGs as PDFs
        let forceFormat = undefined;
        if (isImage) {
            if (file.type === 'image/png') forceFormat = 'png';
            else if (file.type === 'image/webp') forceFormat = 'webp';
            else forceFormat = 'jpg'; // Default to jpg for other images
        }

        // Generate a unique Public ID
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const sanitizedName = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const publicId = `zvenia_uploads/${timestamp}_${randomSuffix}_${sanitizedName}`;

        return new Promise((resolve) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    public_id: publicId,
                    format: forceFormat, // Explicitly force format
                    overwrite: false,
                    use_filename: true,
                    unique_filename: false
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload failure:", error);
                        resolve(new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 }));
                        return;
                    }

                    console.log("Cloudinary Upload Result:", result); // DEBUG

                    resolve(new Response(JSON.stringify({
                        url: result?.secure_url,
                        format: result?.format,
                        resource_type: result?.resource_type
                    }), { status: 200 }));
                }
            );

            uploadStream.end(buffer);
        });

    } catch (error) {
        console.error("Upload handler error:", error);
        return new Response(JSON.stringify({ error: "Server error during upload" }), { status: 500 });
    }
};

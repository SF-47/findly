const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const UNIVERSITY_CARDS_BUCKET = "universities-cards";

function getFileExtension(asset) {
  const fileNameExtension = asset.fileName?.split(".").pop();
  const uriExtension = asset.uri?.split(".").pop()?.split("?")[0];
  const extension = fileNameExtension || uriExtension || "jpg";

  return extension.toLowerCase();
}

function getContentType(asset) {
  if (asset.mimeType) {
    return asset.mimeType;
  }

  const extension = getFileExtension(asset);

  if (extension === "png") {
    return "image/png";
  }

  if (extension === "webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

function createCardFilePath(asset) {
  const extension = getFileExtension(asset);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `students/${uniqueName}.${extension}`;
}

export async function uploadUniversityCardImage(asset) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase mobile config is missing.");
  }

  const filePath = createCardFilePath(asset);
  const contentType = getContentType(asset);
  const fileResponse = await fetch(asset.uri);
  const fileBlob = await fileResponse.blob();

  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${UNIVERSITY_CARDS_BUCKET}/${filePath}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": contentType,
        "x-upsert": "false",
      },
      body: fileBlob,
    },
  );

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(errorText || "Failed to upload university card image.");
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${UNIVERSITY_CARDS_BUCKET}/${filePath}`;
}

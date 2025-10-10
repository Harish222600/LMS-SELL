// S3 folder structure (replaces Supabase buckets)
const S3_FOLDERS = {
    IMAGES: 'images',
    VIDEOS: 'videos',
    DOCUMENTS: 'documents',
    PROFILES: 'profiles',
    COURSES: 'courses',
    CHAT: 'chat-files'
};

// File size limits (same as before)
const FILE_SIZE_LIMITS = {
    IMAGE: 10 * 1024 * 1024,    // 10MB
    VIDEO: 2 * 1024 * 1024 * 1024, // 2GB
    DOCUMENT: 50 * 1024 * 1024, // 50MB
    PROFILE: 5 * 1024 * 1024    // 5MB
};

// Chunked upload configuration
const CHUNKED_UPLOAD_CONFIG = {
    CHUNK_THRESHOLD: 100 * 1024 * 1024, // 100MB for S3
    CHUNK_SIZE: 50 * 1024 * 1024, // 50MB chunks
    MAX_RETRIES: 3,
    RETRY_DELAY_BASE: 1000
};

// Allowed file types (updated to allow any image type)
const ALLOWED_FILE_TYPES = {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'],
    VIDEOS: [
        'video/mp4', 'video/mpeg', 'video/quicktime', 
        'video/x-msvideo', 'video/webm', 'video/x-matroska',
        'video/x-flv', 'video/x-ms-wmv', 'application/octet-stream'
    ],
    DOCUMENTS: [
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
};

// Function to get S3 folder for file type
const getS3FolderForFileType = (mimetype, customFolder, originalname) => {
    if (customFolder) {
        return customFolder;
    }

    if (ALLOWED_FILE_TYPES.IMAGES.includes(mimetype)) {
        return S3_FOLDERS.IMAGES;
    }
    
    if (ALLOWED_FILE_TYPES.VIDEOS.includes(mimetype) || isVideoFile(mimetype, originalname)) {
        return S3_FOLDERS.VIDEOS;
    }
    
    if (ALLOWED_FILE_TYPES.DOCUMENTS.includes(mimetype)) {
        return S3_FOLDERS.DOCUMENTS;
    }
    
    return S3_FOLDERS.DOCUMENTS; // Default fallback
};

// Function to get S3 bucket name for file type (returns the main bucket)
const getS3BucketForFileType = (mimetype, customFolder, originalname) => {
    // For now, all files go to the same bucket with different folders
    // This can be expanded later to use different buckets for different file types
    return process.env.AWS_S3_BUCKET_NAME || 'sample-lms-bucket';
};

// Function to validate file
const validateFile = (file, folder) => {
    const errors = [];
    
    // For signed URL generation, we only have metadata (no buffer)
    // For actual file upload, we have the buffer
    if (!file) {
        errors.push('No file provided');
        return { isValid: false, errors };
    }

    // Check file size based on type (if size is provided)
    if (file.size !== undefined) {
        let maxSize = FILE_SIZE_LIMITS.DOCUMENT; // Default
        
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            maxSize = FILE_SIZE_LIMITS.IMAGE;
        } else if (file.mimetype && (file.mimetype.startsWith('video/') || isVideoFile(file.mimetype, file.originalname))) {
            maxSize = FILE_SIZE_LIMITS.VIDEO;
        }

        if (file.size > maxSize) {
            errors.push(`File size exceeds limit of ${Math.round(maxSize / (1024 * 1024))}MB`);
        }
    }

    // Check file type (if mimetype is provided)
    if (file.mimetype) {
        const isImageType = file.mimetype.startsWith('image/');
        const isValidType = 
            isImageType ||
            ALLOWED_FILE_TYPES.VIDEOS.includes(file.mimetype) ||
            ALLOWED_FILE_TYPES.DOCUMENTS.includes(file.mimetype) ||
            isVideoFile(file.mimetype, file.originalname);

        if (!isValidType) {
            errors.push(`File type ${file.mimetype} is not allowed`);
        }
    }

    // Additional validation for video files
    const isVideo = file.mimetype && (file.mimetype.startsWith('video/') || isVideoFile(file.mimetype, file.originalname));
    const detectedAsVideo = isVideo;
    const willUseResumableUpload = file.size && file.size > CHUNKED_UPLOAD_CONFIG.CHUNK_THRESHOLD;

    return {
        isValid: errors.length === 0,
        errors,
        isVideo: detectedAsVideo,
        detectedAsVideo,
        willUseResumableUpload
    };
};

// Function to check if file is video
const isVideoFile = (mimetype, originalname) => {
    if (ALLOWED_FILE_TYPES.VIDEOS.includes(mimetype)) {
        return true;
    }
    
    if (originalname) {
        const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp'];
        const extension = originalname.toLowerCase().substring(originalname.lastIndexOf('.'));
        return videoExtensions.includes(extension);
    }
    
    return false;
};

module.exports = {
    S3_FOLDERS,
    FILE_SIZE_LIMITS,
    ALLOWED_FILE_TYPES,
    CHUNKED_UPLOAD_CONFIG,
    getS3FolderForFileType,
    getS3BucketForFileType,
    validateFile,
    isVideoFile
};

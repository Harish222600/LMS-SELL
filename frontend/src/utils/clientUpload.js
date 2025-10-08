import axios from 'axios';
import { apiConnector } from '../services/apiConnector';

/**
 * Client-side upload utility for direct S3 uploads
 * This bypasses the server for better performance
 */

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please login again.');
    }
    return token;
};

/**
 * Upload file directly to S3 using signed URL
 * @param {File} file - The file to upload
 * @param {string} folder - The S3 folder (e.g., 'profiles', 'courses', 'videos')
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {Object} options - Additional options (abortSignal for cancellation)
 * @returns {Promise<Object>} Upload result with secure_url and metadata
 */
export const uploadToS3Direct = async (file, folder = '', onProgress = null, options = {}) => {
    try {
        console.log('🚀 Starting client-side upload to S3...', {
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            folder
        });

        // Get authentication token
        const token = getAuthToken();

        // Step 1: Get signed URL from backend with authentication
        const signedUrlResponse = await apiConnector('POST', '/api/v1/upload/signed-url', {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            folder: folder
        }, {
            Authorization: `Bearer ${token}`
        });

        const { uploadId, signedUrl, filePath, bucket } = signedUrlResponse.data.data;

        console.log('✅ Signed URL received:', { uploadId, bucket, filePath });
        console.log('🔍 AbortSignal state before upload:', {
            hasSignal: !!options.abortSignal,
            isAborted: options.abortSignal?.aborted,
            signalType: typeof options.abortSignal
        });

        // Step 2: Upload directly to S3 (no auth headers needed)
        await axios.put(signedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
            signal: options.abortSignal, // Support for cancellation
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            }
        });

        console.log('✅ File uploaded to S3 successfully');

        // Step 3: Notify backend of completion (for metadata extraction) with authentication
        const completionResponse = await apiConnector('POST', '/api/v1/upload/complete', {
            uploadId
        }, {
            Authorization: `Bearer ${token}`
        });

        const result = completionResponse.data.data;

        console.log('✅ Upload completed:', {
            url: result.secure_url,
            duration: result.duration,
            size: `${(result.size / (1024 * 1024)).toFixed(2)}MB`
        });

        return result;

    } catch (error) {
        // Check if the error is due to cancellation
        if (axios.isCancel(error) || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
            console.log('🚫 Upload cancelled by user');
            throw new Error('Upload cancelled');
        }
        
        console.error('❌ Client-side upload failed:', error);
        
        // Provide user-friendly error messages
        if (error.response?.status === 400) {
            throw new Error(error.response.data.message || 'Invalid file. Please check file size and type.');
        } else if (error.response?.status === 413) {
            throw new Error('File is too large. Please choose a smaller file.');
        } else if (error.message.includes('Network Error')) {
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw new Error(error.response?.data?.message || 'Upload failed. Please try again.');
        }
    }
};

/**
 * Upload image with optional client-side compression
 * @param {File} file - Image file
 * @param {string} folder - S3 folder
 * @param {Function} onProgress - Progress callback
 * @param {Object} options - Options including abortSignal for cancellation
 * @returns {Promise<Object>} Upload result
 */
export const uploadImageToS3 = async (file, folder = 'images', onProgress = null, options = {}) => {
    try {
        // Validate it's an image
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Optional: Add client-side compression here if needed
        // For now, upload directly
        return await uploadToS3Direct(file, folder, onProgress, options);

    } catch (error) {
        console.error('❌ Image upload failed:', error);
        throw error;
    }
};

/**
 * Upload video file
 * @param {File} file - Video file
 * @param {string} folder - S3 folder
 * @param {Function} onProgress - Progress callback
 * @param {Object} options - Options including abortSignal for cancellation
 * @returns {Promise<Object>} Upload result with duration
 */
export const uploadVideoToS3 = async (file, folder = 'videos', onProgress = null, options = {}) => {
    try {
        // Validate it's a video
        const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'flv', 'webm'];
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (!videoExtensions.includes(extension) && !file.type.startsWith('video/')) {
            throw new Error('File must be a video');
        }

        const result = await uploadToS3Direct(file, folder, onProgress, options);

        // Ensure duration is included
        if (!result.duration && result.duration !== 0) {
            console.warn('⚠️ Video duration not extracted, defaulting to 0');
            result.duration = 0;
        }

        return result;

    } catch (error) {
        console.error('❌ Video upload failed:', error);
        throw error;
    }
};

/**
 * Cancel an ongoing upload
 * @param {string} uploadId - Upload ID to cancel
 */
export const cancelUpload = async (uploadId) => {
    try {
        const token = getAuthToken();
        await apiConnector('POST', `/api/v1/upload/cancel/${uploadId}`, null, {
            Authorization: `Bearer ${token}`
        });
        console.log('✅ Upload cancelled:', uploadId);
    } catch (error) {
        console.error('❌ Failed to cancel upload:', error);
        throw error;
    }
};

/**
 * Get upload status
 * @param {string} uploadId - Upload ID
 * @returns {Promise<Object>} Upload status
 */
export const getUploadStatus = async (uploadId) => {
    try {
        const token = getAuthToken();
        const response = await apiConnector('GET', `/api/v1/upload/status/${uploadId}`, null, {
            Authorization: `Bearer ${token}`
        });
        return response.data.data;
    } catch (error) {
        console.error('❌ Failed to get upload status:', error);
        throw error;
    }
};

/**
 * Fallback to server-side upload if client-side fails
 * @param {File} file - File to upload
 * @param {string} endpoint - Server endpoint
 * @param {string} fieldName - Form field name
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result
 */
export const uploadViaServer = async (file, endpoint, fieldName = 'file', onProgress = null) => {
    try {
        console.log('⚠️ Falling back to server-side upload...');

        const token = getAuthToken();
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            }
        });

        return response.data;

    } catch (error) {
        console.error('❌ Server-side upload failed:', error);
        throw error;
    }
};

/**
 * Smart upload - tries client-side first, falls back to server-side
 * @param {File} file - File to upload
 * @param {string} folder - S3 folder
 * @param {string} serverEndpoint - Fallback server endpoint
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result
 */
export const smartUpload = async (file, folder, serverEndpoint, onProgress = null) => {
    try {
        // Try client-side upload first
        return await uploadToS3Direct(file, folder, onProgress);
    } catch (error) {
        console.warn('⚠️ Client-side upload failed, trying server-side...', error.message);
        
        try {
            // Fallback to server-side upload
            return await uploadViaServer(file, serverEndpoint, 'file', onProgress);
        } catch (serverError) {
            console.error('❌ Both client-side and server-side uploads failed');
            throw new Error('Upload failed. Please try again or contact support.');
        }
    }
};

export default {
    uploadToS3Direct,
    uploadImageToS3,
    uploadVideoToS3,
    cancelUpload,
    getUploadStatus,
    uploadViaServer,
    smartUpload
};

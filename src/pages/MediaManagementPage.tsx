import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImages, uploadVideos } from '@/services/storageService';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MediaManagementPage = () => {
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploadedFiles, setUploadedFiles] = useState<{url: string, name: string, type: string}[]>([]);

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Upload images to Cloudinary
      const imageUrls = await uploadImages(
        Array.from(files), 
        'hotel-images'
      );
      
      // Add to uploaded files list
      const newFiles = Array.from(files).map((file, index) => ({
        url: imageUrls[index],
        name: file.name,
        type: 'image'
      }));
      
      setUploadedFiles(prev => [...newFiles, ...prev]);
      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  // Handle video upload
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Upload videos to Cloudinary
      const videoUrls = await uploadVideos(
        Array.from(files), 
        'hotel-videos'
      );
      
      // Add to uploaded files list
      const newFiles = Array.from(files).map((file, index) => ({
        url: videoUrls[index],
        name: file.name,
        type: 'video'
      }));
      
      setUploadedFiles(prev => [...newFiles, ...prev]);
      toast.success(`${videoUrls.length} video(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload videos');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
  };

  // Trigger image file input click
  const triggerImageFileInput = () => {
    setMediaType('image');
    if (imageFileInputRef.current) {
      imageFileInputRef.current.click();
    }
  };

  // Trigger video file input click
  const triggerVideoFileInput = () => {
    setMediaType('video');
    if (videoFileInputRef.current) {
      videoFileInputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Media Management</h1>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="flex space-x-4 mb-4">
              <Button 
                onClick={triggerImageFileInput}
                disabled={uploading}
                className="flex items-center"
                variant={mediaType === 'image' ? 'default' : 'outline'}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {uploading && mediaType === 'image' ? 'Uploading...' : 'Upload Images'}
              </Button>
              <Button 
                onClick={triggerVideoFileInput}
                disabled={uploading}
                className="flex items-center"
                variant={mediaType === 'video' ? 'default' : 'outline'}
              >
                <Video className="mr-2 h-4 w-4" />
                {uploading && mediaType === 'video' ? 'Uploading...' : 'Upload Videos'}
              </Button>
            </div>
            <Input
              type="file"
              ref={imageFileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Input
              type="file"
              ref={videoFileInputRef}
              className="hidden"
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
            />
            <p className="text-sm text-gray-500 mt-2">
              {mediaType === 'image' 
                ? 'PNG, JPG, GIF up to 10MB' 
                : 'MP4, MOV, AVI up to 100MB'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Media</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No media uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 capitalize">{file.type}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagementPage;
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Upload, X, Plus, MapPin, Tag, FileText, DollarSign, Phone, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export default function PostAdPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    categoryId: '',
    city: '',
    area: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/post-ad');
    }
  }, [status, router]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [imageFiles]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imageFiles.length + files.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }

    const newImages: ImageFile[] = [];
    for (const file of Array.from(files)) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      newImages.push({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7),
      });
    }

    setImageFiles((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === imageFiles.length - 1) return;

    setImageFiles((prev) => {
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const imageFile of imageFiles) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile.file);
      uploadFormData.append('folder', 'ads');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        throw new Error(`Failed to upload ${imageFile.file.name}`);
      }
    }

    return uploadedUrls;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.condition) {
      newErrors.condition = 'Please select a condition';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }

    if (imageFiles.length === 0) {
      newErrors.images = 'Please upload at least one image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Upload images first
      toast.loading('Uploading images...');
      const uploadedImages = await uploadImages();
      toast.dismiss();

      // Then create the ad
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images: uploadedImages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Ad posted successfully! It will be visible after admin approval.');
        router.push('/my-ads');
      } else {
        toast.error(data.error || 'Failed to post ad. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olx" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Post Your Ad</h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Photos ({imageFiles.length}/8)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {imageFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {imageFiles.map((image, index) => (
                        <div key={image.id} className="relative aspect-square group">
                          <Image
                            src={image.preview}
                            alt={`Upload ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                          {/* Cover badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-olx text-white text-xs px-2 py-1 rounded">
                              Cover
                            </div>
                          )}
                          {/* Controls */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                              className="p-1 bg-white rounded-full disabled:opacity-50"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === imageFiles.length - 1}
                              className="p-1 bg-white rounded-full disabled:opacity-50"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1 bg-red-500 text-white rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {/* Order number */}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {imageFiles.length < 8 && (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-olx-accent transition-colors">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="text-gray-600">Add Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </label>
                  )}
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Upload up to 8 photos. First photo will be the cover image. Drag or use arrows to reorder.
                  </p>
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="What are you selling?"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                    >
                      <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) =>
                          setFormData({ ...formData, condition: value })
                        }
                      >
                        <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="USED">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.condition && (
                        <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="price">Price (Rs) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder="Enter price"
                          className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe what you're selling..."
                    rows={6}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          setFormData({ ...formData, city: value })
                        }
                      >
                        <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot'].map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="area">Area (Optional)</Label>
                      <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) =>
                          setFormData({ ...formData, area: e.target.value })
                        }
                        placeholder="e.g., Gulshan-e-Iqbal"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="03XX-XXXXXXX"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      If not provided, your profile phone number will be used
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-olx hover:bg-olx-light"
                  disabled={isLoading}
                >
                  {isLoading ? 'Posting...' : 'Post Ad'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

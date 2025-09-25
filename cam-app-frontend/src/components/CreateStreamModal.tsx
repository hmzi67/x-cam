import React, { useState, useRef, ChangeEvent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, VideoCameraIcon, UserIcon, TagIcon, PhotoIcon, DocumentTextIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
// Add a style tag with animation for subtle neon glow pulsing
const styleTag = typeof document !== "undefined" && document.head.appendChild(document.createElement("style"));
if (styleTag) {
  styleTag.innerHTML = `
    @keyframes subtle-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    .animate-pulse-subtle {
      animation: subtle-pulse 2s ease-in-out infinite;
    }
  `;
}
import { Categories, Streams, StreamsCategories } from "@/types/Schema";
import { useRouter } from "next/navigation";
import { createAnItem } from "@/server-actions/streams";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { CreateStreamResponse } from "@/lib/controller";
import Image from "next/image";

interface CreateStreamModalProps {
  open: boolean;
  onClose: () => void;
  categories: Categories[];
}

export default function CreateStreamModal({
  open,
  onClose,
  categories,
}: CreateStreamModalProps) {
  const [formData, setFormData] = useState<Partial<Streams>>({
    title: "",
    category: [],
    age_restriction: 13,
    description: "",
    max_viewers: 100,
    thumbnail_url: "",
  });
  
  const [selectedCategories, setSelectedCategories] = useState<Categories[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState<boolean>(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userState = useAppSelector(getUser);
  if (!userState) return;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData?.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (formData?.title?.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!selectedCategories || selectedCategories.length === 0) {
      newErrors.category = "At least one category is required";
    }

    if (!formData?.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData?.description?.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!thumbnailFile && !formData.thumbnail_url) {
      newErrors.thumbnail = "Thumbnail is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        thumbnail: 'Invalid file type. Only JPEG, PNG, and WEBP allowed'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        thumbnail: 'File size exceeds 5MB limit'
      });
      return;
    }

    // Clear previous errors
    if (errors.thumbnail) {
      const newErrors = { ...errors };
      delete newErrors.thumbnail;
      setErrors(newErrors);
    }

    // Update state
    setThumbnailFile(file);
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return null;
    
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', thumbnailFile);

      const response = await fetch('/api/upload-thumbnail', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to upload thumbnail');
      }

      setUploadingThumbnail(false);
      return result.fileUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      setErrors({
        ...errors,
        thumbnail: 'Failed to upload thumbnail'
      });
      setUploadingThumbnail(false);
      return null;
    }
  };

  const onGoLive = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1️⃣ Upload thumbnail if available
      let thumbnailUrl = formData.thumbnail_url;
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
        if (!thumbnailUrl) {
          setLoading(false);
          return;
        }
      }

      // 2️⃣ Prepare category data
      const categoryData = selectedCategories.map(cat => ({
        categories_name: cat.name
      }));

      // 3️⃣ create stream in backend
      const res = await createAnItem("streams", {
        ...formData,
        thumbnail_url: thumbnailUrl,
        category: categoryData,
        status: "live",
      });
      
      if (!res.success) {
        setErrors({ title: res?.data as string });
        setLoading(false);
        return;
      }

      // reset form & errors
      setFormData({
        title: "",
        category: [],
        age_restriction: 13,
        description: "",
        max_viewers: 100,
        thumbnail_url: "",
      });
      setSelectedCategories([]);
      setThumbnailPreview("");
      setThumbnailFile(null);
      setErrors({});

      const streamData = res.data;

      // 4️⃣ create live room
      const liveRes = await fetch("/api/create_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: streamData?.id,
          metadata: {
            creator_identity: `${userState?.first_name} ${userState?.last_name}`,
            enable_chat: true,
            allow_participation: true,
          },
        }),
      });

      const {
        auth_token,
        connection_details: { token },
      } = (await liveRes.json()) as CreateStreamResponse;

      // 5️⃣ redirect → keep loader until navigation
      router.push(`/stream/host?at=${auth_token}&rt=${token}`);

      // close popup & stop loading after navigation
      onClose();
      setLoading(false);
    } catch (error) {
      console.error("Failed to go live:", error);
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Streams, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };
  
  const toggleCategory = (category: Categories) => {
    const isSelected = selectedCategories.some(cat => cat.name === category.name);
    
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter(cat => cat.name !== category.name));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };
  
  const removeCategory = (categoryToRemove: Categories) => {
    setSelectedCategories(selectedCategories.filter(
      category => category.name !== categoryToRemove.name
    ));
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && 
          !categoryDropdownRef.current.contains(event.target as Node) &&
          categoryInputRef.current && 
          !categoryInputRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownRef]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#18181b] border border-gray-700 shadow-2xl transition-all backdrop-blur-sm relative before:absolute before:inset-0 before:rounded-xl before:border before:border-purple-500/30 before:shadow-[0_0_15px_rgba(168,85,247,0.25)] before:pointer-events-none">
                <div className="border-b border-gray-800/80 flex justify-between items-center p-4 bg-gradient-to-r from-[#18181b] to-[#1f1f23]">
                  <Dialog.Title className="text-lg font-medium flex items-center gap-2 text-white">
                    <VideoCameraIcon className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_6px_rgba(232,121,249,0.7)]" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400 font-semibold">Create New Stream</span>
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-fuchsia-400 hover:shadow-[0_0_5px_rgba(232,121,249,0.7)] focus:outline-none transition-all rounded-full p-1"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Stream Title Input */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <VideoCameraIcon className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]" />
                      <label htmlFor="title" className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200">
                        Stream Title
                      </label>
                    </div>
                    <div className="relative group">
                      <input
                        id="title"
                        className={`w-full rounded bg-[#18181b] border ${
                          formData.title 
                            ? "border-fuchsia-500 shadow-[0_0_10px_rgba(232,121,249,0.3)]" 
                            : errors.title 
                              ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                              : "border-gray-700"
                        } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(232,121,249,0.4)] focus:ring-1 focus:ring-fuchsia-400 transition-all group-hover:border-purple-500/70`}
                        placeholder="Enter an engaging title for your stream"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>
                    {errors.title && (
                      <p className="text-sm text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)] mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Categories Selection */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TagIcon className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]" />
                      <label className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200">
                        Categories
                      </label>
                    </div>
                    
                    <div className="relative group">
                      <div 
                        className={`w-full rounded bg-[#18181b] border ${
                          selectedCategories.length > 0 
                            ? "border-fuchsia-500 shadow-[0_0_10px_rgba(232,121,249,0.3)]" 
                            : errors.category 
                              ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                              : "border-gray-700"
                        } text-gray-100 px-4 py-3 min-h-[48px] focus-within:border-fuchsia-400 focus-within:shadow-[0_0_15px_rgba(232,121,249,0.4)] focus-within:ring-1 focus-within:ring-fuchsia-400 transition-all group-hover:border-purple-500/70`}
                      >
                        <div className="flex flex-wrap gap-2 mb-1">
                          {selectedCategories.map((category) => (
                            <span 
                              key={category.name} 
                              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-[0_0_8px_rgba(232,121,249,0.4)] animate-pulse-subtle"
                            >
                              {category.name}
                              <button
                                onClick={() => removeCategory(category)}
                                className="ml-1 text-white hover:text-white/70 focus:outline-none"
                              >
                                <XMarkIcon className="h-3.5 w-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                        
                        <input 
                          ref={categoryInputRef}
                          type="text"
                          className="bg-transparent border-none outline-none p-0 text-sm w-full mt-1"
                          placeholder={selectedCategories.length === 0 ? "Select categories" : ""}
                          onFocus={() => setShowCategoryDropdown(true)}
                        />
                      </div>
                      
                      {showCategoryDropdown && (
                        <div 
                          ref={categoryDropdownRef}
                          className="absolute left-0 right-0 mt-1 bg-[#1f1f23] border border-purple-500/20 rounded-md shadow-[0_4px_20px_-2px_rgba(168,85,247,0.4)] backdrop-blur-sm max-h-60 overflow-y-auto z-10"
                        >
                          {categories.length === 0 ? (
                            <p className="text-gray-400 text-sm p-3">No categories found</p>
                          ) : (
                            categories.map((category) => (
                              <div 
                                key={category.name}
                                onClick={() => toggleCategory(category)}
                                className={`px-4 py-2 cursor-pointer transition-all flex items-center gap-2 ${
                                  selectedCategories.some(c => c.name === category.name) 
                                    ? "bg-gradient-to-r from-purple-800/40 to-fuchsia-800/40 text-fuchsia-300 shadow-[0_0_8px_rgba(232,121,249,0.2)] border-l-2 border-fuchsia-400" 
                                    : "text-gray-300 hover:bg-purple-900/20 hover:shadow-[0_0_5px_rgba(168,85,247,0.2)]"
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  selectedCategories.some(c => c.name === category.name) 
                                    ? "bg-fuchsia-500 border-fuchsia-400 shadow-[0_0_4px_rgba(232,121,249,0.6)]" 
                                    : "border-gray-500"
                                }`}>
                                  {selectedCategories.some(c => c.name === category.name) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </span>
                                {category.name}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)] mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Age Restriction */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <UserIcon className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]" />
                      <label className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200">
                        Minimum Age: <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]">{formData.age_restriction}+</span>
                      </label>
                    </div>
                    
                    <div className="px-2 py-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-lg blur-sm"></div>
                        <input
                          type="range"
                          min="13"
                          max="21"
                          step="1"
                          value={formData.age_restriction}
                          onChange={(e) => handleChange("age_restriction", Number(e.target.value))}
                          className="relative w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-fuchsia-500 [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(232,121,249,0.7)]"
                          style={{
                            background: `linear-gradient(to right, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0.8) ${((formData.age_restriction - 13) / (21 - 13)) * 100}%, rgba(31, 31, 35, 0.8) ${((formData.age_restriction - 13) / (21 - 13)) * 100}%, rgba(31, 31, 35, 0.8) 100%)`
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">13+</span>
                        <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">16+</span>
                        <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">18+</span>
                        <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">21+</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DocumentTextIcon className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]" />
                      <label htmlFor="description" className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200">
                        Description
                      </label>
                    </div>
                    <div className="relative group">
                      <textarea
                        id="description"
                        rows={3}
                        className={`w-full rounded bg-[#18181b] border ${
                          formData.description 
                            ? "border-fuchsia-500 shadow-[0_0_10px_rgba(232,121,249,0.3)]" 
                            : errors.description 
                              ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                              : "border-gray-700"
                        } text-gray-100 px-4 py-3 text-base focus:outline-none focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(232,121,249,0.4)] focus:ring-1 focus:ring-fuchsia-400 transition-all group-hover:border-purple-500/70`}
                        placeholder="Describe what your stream will be about..."
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                      ></textarea>
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)] mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Stream Settings Section */}
                  <div className="bg-gradient-to-br from-[#27272a] to-[#1f1f23] border border-gray-700 rounded-lg p-4 space-y-4 relative before:absolute before:inset-0 before:rounded-lg before:border before:border-purple-500/20 before:shadow-[0_0_20px_rgba(168,85,247,0.15)] before:pointer-events-none">
                    <h3 className="text-white font-medium flex items-center gap-2 relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400 font-medium">Stream Settings</span>
                    </h3>

                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200">
                        Stream Thumbnail
                      </label>
                      <div 
                        className={`border ${
                          errors.thumbnail 
                            ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                            : thumbnailPreview 
                              ? "border-fuchsia-500 shadow-[0_0_15px_rgba(232,121,249,0.3)]" 
                              : "border-dashed border-gray-600"
                        } 
                        rounded-lg bg-[#18181b] h-[140px] overflow-hidden cursor-pointer hover:border-fuchsia-400 hover:shadow-[0_0_15px_rgba(232,121,249,0.3)] transition-all relative`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {thumbnailPreview ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-tl from-fuchsia-600/20 to-transparent pointer-events-none z-10"></div>
                            <img 
                              src={thumbnailPreview} 
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover" 
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                            <PhotoIcon className="h-10 w-10 text-fuchsia-500 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)] mb-2" />
                            <p className="text-sm text-fuchsia-200">Click to upload a thumbnail image</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 1280×720 | Max: 5MB | JPG, PNG, WEBP</p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleThumbnailChange}
                        />
                      </div>
                      {errors.thumbnail && (
                        <p className="text-sm text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.3)]">{errors.thumbnail}</p>
                      )}
                      {thumbnailPreview && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 hover:shadow-[0_0_8px_rgba(232,121,249,0.4)] text-sm transition-all"
                        >
                          <ArrowUpTrayIcon className="h-4 w-4 drop-shadow-[0_0_3px_rgba(232,121,249,0.5)]" />
                          <span className="drop-shadow-[0_0_3px_rgba(232,121,249,0.5)]">Change Image</span>
                        </button>
                      )}
                    </div>

                    {/* Max Viewers */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200">
                        Maximum Viewers: <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]">{formData.max_viewers}</span>
                      </label>
                      <div className="px-2 py-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-lg blur-sm"></div>
                          <input
                            type="range"
                            min="10"
                            max="1000"
                            step="10"
                            value={formData.max_viewers}
                            onChange={(e) => handleChange("max_viewers", Number(e.target.value))}
                            className="relative w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-fuchsia-500 [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(232,121,249,0.7)]"
                            style={{
                              background: `linear-gradient(to right, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0.8) ${(formData.max_viewers - 10) / (1000 - 10) * 100}%, rgba(31, 31, 35, 0.8) ${(formData.max_viewers - 10) / (1000 - 10) * 100}%, rgba(31, 31, 35, 0.8) 100%)`
                            }}
                          />
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">10</span>
                          <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">100</span>
                          <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">500</span>
                          <span className="text-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">1K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Alert */}
                  <div className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 border border-fuchsia-500/30 rounded-lg p-4 text-fuchsia-200 text-sm shadow-[0_0_20px_rgba(232,121,249,0.15)] relative before:absolute before:inset-0 before:rounded-lg before:border before:border-purple-500/10 before:shadow-[0_0_10px_rgba(168,85,247,0.1)] before:pointer-events-none">
                    <p className="drop-shadow-[0_0_1px_rgba(232,121,249,0.5)]">Your stream will be visible to other users once you go live. Make sure your content follows our community guidelines.</p>
                  </div>

                  {/* Error Alert */}
                  {Object.keys(errors).length > 0 && (
                    <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.15)]" role="alert">
                      <p className="text-sm drop-shadow-[0_0_1px_rgba(239,68,68,0.5)]">Please correct the errors above before going live.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 px-6 py-4 flex justify-end gap-3 relative">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent"></div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:border-fuchsia-500/50 hover:text-fuchsia-300 hover:shadow-[0_0_10px_rgba(232,121,249,0.2)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onGoLive}
                    disabled={loading || uploadingThumbnail}
                    className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg flex items-center gap-2 min-w-[120px] justify-center shadow-[0_0_15px_rgba(232,121,249,0.4)] border border-fuchsia-500/50
                      ${loading || uploadingThumbnail ? 
                        'opacity-70 cursor-not-allowed' : 
                        'hover:shadow-[0_0_20px_rgba(232,121,249,0.5)] hover:from-fuchsia-600 hover:to-purple-600'
                      } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40`}
                  >
                    {loading || uploadingThumbnail ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]">
                          {loading ? "Creating..." : "Uploading..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <VideoCameraIcon className="h-4 w-4 drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
                        <span className="drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]">Go Live</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Loading Indicator */}
                {(loading || uploadingThumbnail) && (
                  <div className="w-full h-1 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 h-1 animate-pulse shadow-[0_0_8px_rgba(232,121,249,0.6)]"></div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
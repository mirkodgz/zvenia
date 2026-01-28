import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// Define Interface
// Define Interface
interface PostFormData {
    id: string;
    title: string;
    slug: string;
    content: string;
    featured_image_url: string;
    document_url: string;
    source: string;
    topic_id: string;
    metadata: {
        gallery: string[];
        video_url?: string;
        youtube_url?: string;
        [key: string]: any;
    };
}

interface PostFormProps {
    currentUser: any;
    initialData?: Partial<PostFormData> & { editId?: string };
}

export default function PostForm({ currentUser, initialData }: PostFormProps) {

    const [formData, setFormData] = useState<PostFormData>({
        id: initialData?.id || '',
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        featured_image_url: initialData?.featured_image_url || '',
        document_url: initialData?.document_url || '',
        source: initialData?.source || '',
        topic_id: initialData?.topic_id || '', // Use topic_id (slug form)
        metadata: initialData?.metadata || { gallery: [] }
    });

    const [activeMediaType, setActiveMediaType] = useState<'image' | 'video' | 'pdf' | 'youtube'>('image');

    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        try {
            // Process all files
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Strict Type Check
                const isPdf = file.type === 'application/pdf';
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                if (!isPdf && !isImage && !isVideo) {
                    alert(`Format not supported for file: ${file.name}`);
                    continue;
                }

                const uploadFormData = new FormData();
                uploadFormData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.error || 'Upload failed');

                let finalUrl = data.url;

                if (isVideo) {
                    // Video Logic - Last one wins for now as only 1 is supported
                    setFormData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, video_url: finalUrl }
                    }));
                } else if (isPdf) {
                    // PDF Logic: Only 1 Allowed.
                    setFormData(prev => ({ ...prev, document_url: finalUrl }));
                } else {
                    // Image Logic: Gallery Support
                    if (data.format === 'pdf') {
                        finalUrl = finalUrl.replace(/\.pdf$/i, '.jpg');
                    }

                    setFormData(prev => {
                        const currentGallery = prev.metadata?.gallery || [];
                        // If no main image, set as main
                        if (!prev.featured_image_url) {
                            return { ...prev, featured_image_url: finalUrl };
                        }
                        // Otherwise append to gallery
                        return {
                            ...prev,
                            metadata: {
                                ...prev.metadata,
                                gallery: [...currentGallery, finalUrl]
                            }
                        };
                    });
                }
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload one or more files');
        } finally {
            setIsUploading(false);
        }
    };

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.id);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'slug') {
            setIsSlugManuallyEdited(true);
        }

        setFormData((prev) => {
            let newSlug = prev.slug;

            if (name === 'slug') {
                newSlug = value;
            } else if (name === 'title' && !isSlugManuallyEdited) {
                newSlug = value
                    .toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Normalize accents
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }

            return {
                ...prev,
                [name]: value,
                slug: newSlug
            };
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isEdit = !!formData.id;
            const endpoint = isEdit ? '/api/content/update' : '/api/content/create';

            // Ensure gallery is saved in metadata
            const finalPayload = {
                ...formData,
                metadata: formData.metadata // Explicitly include metadata
            };

            // STRICT SANITIZATION: Clear fields based on active tab to prevent mixed content
            if (activeMediaType === 'image') {
                finalPayload.document_url = '';
                finalPayload.metadata.video_url = '';
                finalPayload.metadata.youtube_url = '';
                // Ensure featured_image_url is set if not present but gallery exists
                // Ensure featured_image_url is set if not present but gallery exists
                if (!finalPayload.featured_image_url && finalPayload.metadata.gallery?.length > 0) {
                    finalPayload.featured_image_url = finalPayload.metadata.gallery[0];
                    // Remove the promoted image from the gallery to prevent duplication/resurrection
                    finalPayload.metadata.gallery = finalPayload.metadata.gallery.slice(1);
                }
            } else if (activeMediaType === 'pdf') {
                finalPayload.featured_image_url = '';
                finalPayload.metadata.gallery = [];
                finalPayload.metadata.video_url = '';
                finalPayload.metadata.youtube_url = '';
            } else if (activeMediaType === 'video') {
                finalPayload.featured_image_url = '';
                finalPayload.document_url = '';
                finalPayload.metadata.gallery = [];
                finalPayload.metadata.youtube_url = '';
            } else if (activeMediaType === 'youtube') {
                finalPayload.featured_image_url = '';
                finalPayload.document_url = '';
                finalPayload.metadata.gallery = [];
                finalPayload.metadata.video_url = '';
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(isEdit ? finalPayload : {
                    type: 'post',
                    data: finalPayload
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save post');
            }

            alert(isEdit ? 'Post updated successfully!' : 'Post created successfully!');


            const params = new URLSearchParams(window.location.search);
            const returnTo = params.get('returnTo') || '/';
            window.location.href = returnTo;

        } catch (error: any) {
            console.error("Submission error:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch Post Data if editId is provided (Client-Side Edit Mode)
    useEffect(() => {
        if (!initialData?.id && (initialData as any)?.editId) {
            const fetchPost = async () => {
                const editId = (initialData as any).editId;
                try {
                    const { data: rawPost, error } = await supabase
                        .from('posts')
                        .select('*')
                        .eq('id', editId)
                        .single();

                    if (error || !rawPost) throw error;
                    const post = rawPost as any;

                    // Fetch Topic Slug
                    let topicSlug = '';
                    if (post.topic_id) {
                        const { data: rawTopic } = await supabase
                            .from('topics')
                            .select('slug')
                            .eq('id', post.topic_id)
                            .single();

                        const topic = rawTopic as any;
                        if (topic) topicSlug = topic.slug;
                    }

                    const gallery = post.metadata?.gallery || [];
                    const videoUrl = post.metadata?.video_url;
                    const youtubeUrl = post.metadata?.youtube_url;
                    const docUrl = post.document_url;

                    setFormData({
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        content: post.content,
                        featured_image_url: post.featured_image_url || '',
                        document_url: docUrl || '',
                        source: post.source || '',
                        topic_id: topicSlug,
                        metadata: post.metadata || { gallery: [] }
                    });

                    // Auto-detect Active Media Type
                    if (youtubeUrl) setActiveMediaType('youtube');
                    else if (videoUrl) setActiveMediaType('video');
                    else if (docUrl) setActiveMediaType('pdf');
                    else setActiveMediaType('image'); // Default to image

                } catch (e) {
                    console.error("Error fetching post for edit", e);
                    alert("Failed to load post data.");
                }
            };
            fetchPost();
        }
    }, [initialData]);

    // Fetch Topics on Mount
    const [topics, setTopics] = useState<any[]>([]);
    const [isLoadingTopics, setIsLoadingTopics] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data, error } = await supabase
                    .from('topics')
                    .select('id, name, slug')
                    .order('name', { ascending: true });

                if (error) throw error;
                setTopics(data || []);
            } catch (e) {
                console.error("Error loading topics", e);
            } finally {
                setIsLoadingTopics(false);
            }
        };
        fetchTopics();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <div>
                <label htmlFor="topic_id" className="block text-sm font-medium text-(--text-secondary) mb-2">Topic / Category</label>
                <select
                    id="topic_id"
                    name="topic_id"
                    required
                    value={formData.topic_id} // Bind value to state
                    onChange={handleChange as any}
                    disabled={isLoadingTopics}
                    className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none"
                >
                    <option value="">{isLoadingTopics ? 'Loading topics...' : 'Select a Mining Topic...'}</option>
                    {topics.map(t => (
                        <option key={t.id} value={t.slug}>{t.name}</option>
                    ))}
                </select>
                <p className="text-xs text-(--text-secondary) mt-1">Select the most relevant mining sector for your post.</p>
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-(--text-secondary) mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="How to optimize mining operations..."
                />
            </div>

            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-(--text-secondary) mb-2">Slug (URL)</label>
                <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-(--border-color) bg-(--bg-surface-hover) text-(--text-secondary) sm:text-sm">
                        zvenia.com/post/
                    </span>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        value={formData.slug}
                        onChange={handleChange}
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-md bg-(--bg-body) border border-(--border-color) text-(--text-main) focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-(--text-main) mb-3">What would you like to share? ( Optional )</label>

                {/* Media Type Selector */}
                <div className="flex flex-wrap gap-4 mb-4">
                    {['image', 'video', 'pdf', 'youtube'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => {
                                // Clear other types when switching
                                setFormData(prev => ({
                                    ...prev,
                                    featured_image_url: '',
                                    document_url: '',
                                    metadata: { ...prev.metadata, gallery: [], video_url: '', youtube_url: '' }
                                }));
                                setActiveMediaType(type as any);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all capitalize ${activeMediaType === type
                                ? 'bg-primary-500/20 border-primary-500 text-(--text-main)'
                                : 'bg-(--bg-body) border-(--border-color) text-(--text-secondary) hover:bg-(--bg-surface-hover)'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded-sm border ${activeMediaType === type ? 'bg-primary-500 border-primary-500' : 'border-gray-500'}`}></span>
                            {type === 'youtube' ? 'YouTube Video' : type}
                        </button>
                    ))}
                </div>

                {/* Upload Area / Input Area */}
                <div className="border-2 border-dashed border-(--border-color) rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors bg-(--bg-body) min-h-[200px] flex flex-col justify-center">
                    {activeMediaType === 'youtube' ? (
                        <div className="w-full max-w-md mx-auto">
                            <label className="block text-left text-sm text-(--text-secondary) mb-1">YouTube Video URL</label>
                            <input
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full bg-(--bg-surface) border border-(--border-color) rounded px-3 py-2 text-(--text-main) focus:border-primary-500"
                                value={formData.metadata?.youtube_url || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    metadata: { ...prev.metadata, youtube_url: e.target.value }
                                }))}
                            />
                        </div>
                    ) : (
                        // File Upload Logic (Image, Video, PDF)
                        isUploading ? (
                            <div className="text-(--text-secondary) flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            <>
                                {/* PREVIEWS */}
                                {/* 1. Video Preview */}
                                {formData.metadata?.video_url && activeMediaType === 'video' && (
                                    <div className="relative w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden border border-(--border-color)">
                                        <video src={formData.metadata.video_url} controls className="w-full h-auto max-h-[300px]" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, metadata: { ...prev.metadata, video_url: '' } }))}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md z-10"
                                        >✕</button>
                                    </div>
                                )}

                                {/* 2. PDF Preview */}
                                {formData.document_url && activeMediaType === 'pdf' && (
                                    <div className="relative p-4 bg-(--bg-surface) rounded-lg border border-(--border-color) flex items-center justify-between max-w-md mx-auto w-full">
                                        <div className="flex items-center truncate">
                                            <div className="text-2xl mr-3">📄</div>
                                            <a href={formData.document_url} target="_blank" className="text-sm text-primary-400 hover:underline truncate">{formData.document_url.split('/').pop()}</a>
                                        </div>
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, document_url: '' }))} className="text-red-500 ml-2">✕</button>
                                    </div>
                                )}

                                {/* 3. Image Gallery Preview */}
                                {activeMediaType === 'image' && (formData.featured_image_url || (formData.metadata?.gallery?.length > 0)) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                                        {formData.featured_image_url && (
                                            <div className="relative group aspect-square rounded-lg overflow-hidden border-2 border-primary-500/50">
                                                <img src={formData.featured_image_url} alt="Main" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">Main</span>
                                                </div>
                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-100">✕</button>
                                            </div>
                                        )}
                                        {formData.metadata?.gallery?.map((img: string, idx: number) => (
                                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-(--border-color)">
                                                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setFormData(prev => {
                                                    const newG = [...prev.metadata.gallery];
                                                    newG.splice(idx, 1);
                                                    return { ...prev, metadata: { ...prev.metadata, gallery: newG } };
                                                })} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button (Show if slot available) */}
                                {(!formData.metadata?.video_url && !formData.document_url && activeMediaType !== 'image') || (activeMediaType === 'image') ? (
                                    <div className={`mt-4 ${activeMediaType === 'image' && formData.featured_image_url ? 'inline-block w-24 h-24 align-top ml-2' : ''}`}>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="file-upload"
                                            accept={activeMediaType === 'video' ? 'video/mp4,video/webm,video/ogg' : activeMediaType === 'pdf' ? 'application/pdf' : 'image/*'}
                                            onChange={handleFileUpload}
                                            // Disable if video/pdf already exists (only 1 allowed)
                                            disabled={activeMediaType === 'video' && !!formData.metadata?.video_url || activeMediaType === 'pdf' && !!formData.document_url}
                                            multiple={activeMediaType === 'image'}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={`cursor-pointer flex flex-col items-center justify-center transition-colors ${activeMediaType === 'image' && (formData.featured_image_url)
                                                ? 'w-full h-full border-2 border-dashed border-(--border-color) rounded-lg hover:bg-(--bg-surface-hover)'
                                                : 'inline-block px-4 py-2 bg-(--bg-surface-hover) hover:bg-(--bg-surface) rounded text-sm font-bold text-(--text-main)'
                                                }`}
                                        >
                                            {activeMediaType === 'image' && formData.featured_image_url ? (
                                                <span className="text-2xl text-(--text-secondary)">+</span>
                                            ) : (
                                                <span>{activeMediaType === 'image' && !formData.featured_image_url ? 'Select Images' : activeMediaType === 'video' ? 'Select Video' : 'Select PDF'}</span>
                                            )}
                                        </label>
                                    </div>
                                ) : null}
                            </>
                        )
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="source" className="block text-sm font-medium text-(--text-secondary) mb-2">Source / Reference (URL or Text)</label>
                <input
                    type="text"
                    name="source"
                    id="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="https://example.com or 'Company Internal Report'"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-(--text-secondary) mb-2">Content</label>
                <textarea
                    name="content"
                    id="content"
                    rows={12}
                    required
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-mono text-sm"
                    placeholder="Write your article content here (Markdown supported)..."
                />
            </div>

            <div className="pt-4 border-t border-(--border-color) flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        const returnTo = params.get('returnTo') || '/';
                        window.location.href = returnTo;
                    }}
                    className="mr-3 inline-flex justify-center rounded-md border border-(--border-color) bg-transparent py-3 px-8 text-sm font-medium text-(--text-secondary) shadow-sm hover:bg-(--bg-surface-hover) hover:text-(--text-main) focus:outline-none transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Saving...' : (formData.id ? 'Update Post' : 'Publish Post')}
                </button>
            </div>
        </form >
    );
}

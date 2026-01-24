import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface PostFormData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
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

interface PostFormAdminProps {
    currentUser: any;
    initialData?: Partial<PostFormData>;
    topics: Array<{ id: string; name: string; slug: string }>;
}

export default function PostFormAdmin({ currentUser, initialData, topics }: PostFormAdminProps) {
    const [formData, setFormData] = useState<PostFormData>({
        id: initialData?.id || '',
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        featured_image_url: initialData?.featured_image_url || '',
        document_url: initialData?.document_url || '',
        source: initialData?.source || '',
        topic_id: initialData?.topic_id || '',
        metadata: initialData?.metadata || { gallery: [] }
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.id);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isSlugManuallyEdited && formData.title) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, isSlugManuallyEdited]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'slug') {
            setIsSlugManuallyEdited(true);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'pdf' && file.type !== 'application/pdf') {
            alert('Only PDF files are allowed.');
            return;
        }

        if (type === 'image' && !file.type.startsWith('image/')) {
            alert('Only image files are allowed.');
            return;
        }

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Upload failed');

            let finalUrl = data.url;
            if (type === 'image' && data.format === 'pdf') {
                finalUrl = finalUrl.replace(/\.pdf$/i, '.jpg');
            }

            if (type === 'pdf') {
                setFormData(prev => ({ ...prev, document_url: finalUrl }));
            } else {
                setFormData(prev => ({ ...prev, featured_image_url: finalUrl }));
            }
        } catch (error: any) {
            console.error('Upload Error:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isEdit = !!formData.id;
            const endpoint = isEdit ? '/api/content/update' : '/api/content/create';

            const finalPayload = {
                ...formData,
                metadata: formData.metadata
            };

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
            window.location.href = '/admin/posts';

        } catch (error: any) {
            console.error("Submission error:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter post title"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="post-url-slug"
                    />
                    <p className="mt-1 text-sm text-gray-500">URL-friendly version of the title</p>
                </div>

                {/* Topic */}
                <div>
                    <label htmlFor="topic_id" className="block text-sm font-medium text-gray-700 mb-2">
                        Topic *
                    </label>
                    <select
                        id="topic_id"
                        name="topic_id"
                        value={formData.topic_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">Select a topic</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.slug}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Excerpt */}
                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Brief description of the post"
                    />
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Post content"
                    />
                </div>

                {/* Featured Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                    </label>
                    {formData.featured_image_url && (
                        <div className="mb-2">
                            <img
                                src={formData.featured_image_url}
                                alt="Featured"
                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {isUploading && <p className="mt-1 text-sm text-gray-500">Uploading...</p>}
                </div>

                {/* PDF Document */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        PDF Document (Optional)
                    </label>
                    {formData.document_url && (
                        <div className="mb-2">
                            <a
                                href={formData.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                                View PDF
                            </a>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, 'pdf')}
                        disabled={isUploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                </div>

                {/* Source */}
                <div>
                    <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                        Source
                    </label>
                    <input
                        type="text"
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Source URL or name"
                    />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => window.location.href = '/admin/posts'}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : (formData.id ? 'Update Post' : 'Create Post')}
                    </button>
                </div>
            </form>
        </div>
    );
}


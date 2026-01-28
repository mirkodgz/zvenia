import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// Helper for random IDs in dynamic list
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function PodcastForm({ currentUser, initialData }: { currentUser: any, initialData?: any }) {

    // Lookup Data
    const [topics, setTopics] = useState<any[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        title: initialData?.title || '',
        description: initialData?.description || '',
        topic_id: initialData?.topic_slug || initialData?.topic_id || '', // Handle both slug (create) and potentially ID if passed differently
        host: initialData?.host || '',
        cover_image_url: initialData?.cover_image_url || initialData?.featured_image_url || '',
    });

    // Episodes State (Dynamic Array)
    const [episodes, setEpisodes] = useState<{ id: string, title: string, video_url: string }[]>(
        initialData?.episodes ? initialData.episodes.map((ep: any) => ({ ...ep, id: generateId() })) : []
    );

    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Options
    useEffect(() => {
        const fetchOptions = async () => {
            const { data } = await supabase.from('topics').select('id, name, slug').order('name');
            setTopics(data || []);
            setIsLoadingOptions(false);
        };
        fetchOptions();
    }, []);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Episode Handlers
    const addEpisode = () => {
        setEpisodes(prev => [...prev, { id: generateId(), title: '', video_url: '' }]);
    };

    const removeEpisode = (id: string) => {
        setEpisodes(prev => prev.filter(ep => ep.id !== id));
    };

    const updateEpisode = (id: string, field: 'title' | 'video_url', value: string) => {
        setEpisodes(prev => prev.map(ep => ep.id === id ? { ...ep, [field]: value } : ep));
    };

    // File Upload (Cover Art)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Only images are allowed.');
            return;
        }

        setUploadingField('cover');
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setFormData(prev => ({ ...prev, cover_image_url: data.url }));
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploadingField(null);
        }
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isEdit = !!formData.id;
            const endpoint = isEdit ? '/api/content/update' : '/api/content/create';

            // Clean episodes for DB (remove local UI IDs) and add Index Number
            const cleanEpisodes = episodes.map(({ title, video_url }, index) => ({
                number: index + 1,
                title,
                video_url
            }));

            const payload = {
                ...formData,
                episodes: cleanEpisodes,
                featured_image_url: formData.cover_image_url, // Map for polymorphic consistencies if needed
                type: 'podcast' // Critical for API
            };

            const body = isEdit ? payload : { type: 'podcast', data: payload };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            alert(isEdit ? 'Podcast updated!' : 'Podcast created!');
            window.location.href = '/'; // Go to Feed
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingOptions) return <div className="text-center py-12 text-gray-500">Loading options...</div>;

    const isEditMode = !!formData.id;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">

            {/* 1. Main Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-(--text-main) border-b border-(--border-color) pb-2">Podcast Info</h3>

                {/* Topic */}
                <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">Topic *</label>
                    <select
                        name="topic_id"
                        value={formData.topic_id}
                        onChange={handleChange}
                        required
                        className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) appearance-none focus:border-primary-500 outline-none"
                    >
                        <option value="">Select a Topic</option>
                        {topics.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">Podcast Name / Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Mining Insights Weekly"
                        className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) focus:border-primary-500 outline-none"
                    />
                </div>

                {/* Host */}
                <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">Host Name</label>
                    <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                        placeholder="e.g. Mahlogonolo Mashile"
                        className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) focus:border-primary-500 outline-none"
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">Cover Art</label>
                    {formData.cover_image_url ? (
                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-(--border-color) group">
                            <img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, cover_image_url: '' }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold">Remove</button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-(--border-color) rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors bg-(--bg-body) w-full md:w-1/2">
                            <input type="file" id="cover-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            <label htmlFor="cover-upload" className="cursor-pointer text-primary-400 hover:text-primary-300 block">
                                {uploadingField === 'cover' ? 'Uploading...' : 'Upload Cover Image'}
                            </label>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-(--text-secondary) mb-2">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) focus:border-primary-500 outline-none font-mono text-sm"
                        placeholder="About this podcast..."
                    />
                </div>
            </div>

            {/* 2. Episodes Manager */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-(--border-color) pb-2">
                    <h3 className="text-lg font-bold text-(--text-main)">Episodes</h3>
                    <button type="button" onClick={addEpisode} className="bg-primary-600 hover:bg-primary-500 text-white text-sm px-3 py-1 rounded-md transition-colors">
                        + Add Episode
                    </button>
                </div>

                {episodes.length === 0 && (
                    <div className="text-center py-8 text-(--text-secondary) italic bg-(--bg-surface) rounded-lg border border-(--border-color)">
                        No episodes added yet.
                    </div>
                )}

                <div className="space-y-3">
                    {episodes.map((ep, index) => (
                        <div key={ep.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-(--bg-surface) p-4 rounded-lg border border-(--border-color) animate-fade-in-up">
                            <div className="md:col-span-1 text-center font-mono text-(--text-secondary) text-sm py-3">
                                #{index + 1}
                            </div>
                            <div className="md:col-span-5">
                                <label className="block text-xs text-(--text-secondary) mb-1">Episode Title</label>
                                <input
                                    type="text"
                                    value={ep.title}
                                    onChange={(e) => updateEpisode(ep.id, 'title', e.target.value)}
                                    placeholder="Episode Title"
                                    className="w-full bg-(--bg-body) border border-(--border-color) rounded px-3 py-2 text-sm text-(--text-main) focus:border-primary-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-5">
                                <label className="block text-xs text-(--text-secondary) mb-1">YouTube / Video URL</label>
                                <input
                                    type="url"
                                    value={ep.video_url}
                                    onChange={(e) => updateEpisode(ep.id, 'video_url', e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="w-full bg-(--bg-body) border border-(--border-color) rounded px-3 py-2 text-sm text-(--text-main) focus:border-primary-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <button type="button" onClick={() => removeEpisode(ep.id)} className="text-red-500 hover:text-red-400 p-2" title="Remove">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-(--border-color) flex justify-end">
                <button
                    type="button"
                    onClick={() => window.location.href = '/'}
                    className="mr-3 inline-flex justify-center rounded-md border border-(--border-color) bg-transparent py-3 px-8 text-sm font-medium text-(--text-secondary) shadow-sm hover:bg-(--bg-surface-hover) hover:text-(--text-main) focus:outline-none transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-3 px-8 text-sm font-bold text-white shadow-sm hover:bg-primary-500 focus:outline-none transition-all transform hover:scale-105 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : (isEditMode ? '💾 Update Podcast' : '🚀 Publish Podcast')}
                </button>
            </div>

        </form>
    );
}

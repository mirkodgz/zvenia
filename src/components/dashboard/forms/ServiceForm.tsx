
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function ServiceForm({ currentUser, initialData }: { currentUser: any, initialData?: any }) {
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [types, setTypes] = useState<any[]>([]);
    const [durations, setDurations] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        title: initialData?.title || '',
        description: initialData?.description || '',
        topic_id: initialData?.topic_id || '',
        type_id: initialData?.type_id || '',
        duration_id: initialData?.duration_id || '',
        target_country: initialData?.target_country || '',
        organizer_company: initialData?.organizer_company || '',
        company_link: initialData?.company_link || '',
        contact_email: initialData?.contact_email || '',
        quick_view_image_url: initialData?.quick_view_image_url || initialData?.featured_image_url || '',
    });

    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [
                    { data: typesData },
                    { data: durationsData },
                    { data: topicsData }
                ] = await Promise.all([
                    supabase.from('service_types').select('*').order('name'),
                    supabase.from('service_durations').select('*').order('name'),
                    supabase.from('topics').select('id, name, slug').order('name')
                ]);
                setTypes(typesData || []);
                setDurations(durationsData || []);
                setTopics(topicsData || []);
            } catch (err) {
                console.error('Error fetching options:', err);
            } finally {
                setIsLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setFormData(prev => ({ ...prev, quick_view_image_url: data.url }));
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isEdit = !!formData.id;
            const endpoint = isEdit ? '/api/content/update' : '/api/content/create';

            // Construct Payload
            const payload = {
                ...formData,
                type: 'service', // For API to distinguish
                featured_image_url: formData.quick_view_image_url, // Map to standard field
            };

            const body = isEdit ? payload : { type: 'service', data: payload };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Failed to save service');

            alert(isEdit ? 'Service updated!' : 'Service created!');
            window.location.href = '/';
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingOptions) return <div className="p-8 text-center text-gray-500">Loading options...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">

            {/* Header */}
            <div className="border-b border-[var(--border-color)] pb-4">
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">{formData.id ? 'Edit Service' : 'Create New Service'}</h2>
                <p className="text-sm text-[var(--text-secondary)]">Promote your services to the Zvenia community.</p>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-main)]">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Service Title *</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none" placeholder="e.g. Geological Consulting" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Topic *</label>
                        <select name="topic_id" required value={formData.topic_id} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none">
                            <option value="">Select Topic</option>
                            {topics.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                    <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] outline-none" placeholder="Describe your service..." />
                </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-main)]">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Type of Ad *</label>
                        <select name="type_id" required value={formData.type_id} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none">
                            <option value="">Select Type</option>
                            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Campaign Duration</label>
                        <select name="duration_id" value={formData.duration_id} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none">
                            <option value="">Select Duration</option>
                            {durations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Target Country</label>
                        <input type="text" name="target_country" value={formData.target_country} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)]" placeholder="e.g. Peru" />
                    </div>
                </div>
            </div>

            {/* Visuals */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-main)]">Visuals</h3>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Quick View Image (Card)</label>
                    {formData.quick_view_image_url ? (
                        <div className="relative w-48 h-32 rounded bg-gray-800 overflow-hidden border border-[var(--border-color)] group">
                            <img src={formData.quick_view_image_url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, quick_view_image_url: '' }))} className="absolute inset-0 bg-black/50 text-red-500 opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold">Remove</button>
                        </div>
                    ) : (
                        <div className="w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg flex items-center justify-center hover:border-primary-500/50 transition-colors">
                            <label className="cursor-pointer text-[var(--text-secondary)] hover:text-white">
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Organizer Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-[var(--text-main)]">Organizer / Company</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Company Name</label>
                        <input type="text" name="organizer_company" value={formData.organizer_company} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Company Link</label>
                        <input type="url" name="company_link" value={formData.company_link} onChange={handleChange} className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)]" placeholder="https://" />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex justify-end gap-4">
                <button type="button" onClick={() => window.history.back()} className="px-6 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || uploading} className="px-6 py-3 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : (formData.id ? 'Update Service' : 'Create Service')}
                </button>
            </div>
        </form>
    );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Loader2, Plus, Upload, X } from 'lucide-react';



interface AdsFormProps {
    currentUser: any;
    onSuccess?: () => void;
    initialData?: any;
    onCancel?: () => void;
}

export default function AdsForm({ currentUser, onSuccess, initialData, onCancel }: AdsFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingTopics, setIsLoadingTopics] = useState(true);
    const [topics, setTopics] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '', // Description
        link_url: '',
        image_url: '',
        location: currentUser?.work_country || '', // Default to user's country
        metadata: {
            topics: [] as string[],
            country_manager_id: currentUser?.id
        }
    });

    // Load initial data when editing
    useEffect(() => {
        if (initialData) {
            setIsOpen(true);
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                content: initialData.content || '',
                link_url: initialData.link_url || '',
                image_url: initialData.image_url || '',
                location: initialData.location || currentUser?.work_country || '',
                metadata: {
                    topics: initialData.metadata?.topics || [],
                    country_manager_id: initialData.metadata?.country_manager_id || currentUser?.id
                }
            });
        }
    }, [initialData]);

    // Fetch Topics
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

    // Fetch User Country if not present in props (safeguard)
    useEffect(() => {
        if (!formData.location && currentUser?.id) {
            const fetchProfile = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('work_country')
                    .eq('id', currentUser.id)
                    .single();
                if ((data as any)?.work_country) {
                    setFormData(prev => ({ ...prev, location: (data as any).work_country || '' }));
                }
            };
            fetchProfile();
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            let newSlug = prev.slug;
            if (name === 'title') {
                newSlug = value
                    .toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            if (name === 'slug') {
                newSlug = value;
            }
            return { ...prev, [name]: value, slug: newSlug };
        });
    };

    const handleTopicToggle = (topicId: string) => {
        setFormData(prev => {
            const currentTopics = prev.metadata.topics || [];
            const newTopics = currentTopics.includes(topicId)
                ? currentTopics.filter(id => id !== topicId)
                : [...currentTopics, topicId];
            return {
                ...prev,
                metadata: { ...prev.metadata, topics: newTopics }
            };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const file = files[0];
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Upload failed');

            setFormData(prev => ({ ...prev, image_url: data.url }));
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Check for duplicate slug
            const { data: existing } = await supabase
                .from('ads')
                .select('slug')
                .eq('slug', formData.slug)
                .single();

            let finalSlug = formData.slug;
            if (existing) {
                finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
            }

            const payload = {
                title: formData.title,
                slug: finalSlug,
                content: formData.content,
                image_url: formData.image_url,
                link_url: formData.link_url,
                location: formData.location, // Critical for visibility
                metadata: formData.metadata,
                published_at: new Date().toISOString()
            };

            let error;

            if (initialData) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('ads')
                    // @ts-ignore
                    .update(payload)
                    .eq('id', initialData.id);
                error = updateError;
            } else {
                // INSERT
                const { error: insertError } = await supabase.from('ads').insert(payload as any);
                error = insertError;
            }

            if (error) throw error;

            alert(initialData ? 'ADS Updated Successfully!' : 'ADS Created Successfully!');
            setFormData({
                title: '',
                slug: '',
                content: '',
                link_url: '',
                image_url: '',
                location: currentUser?.work_country || '',
                metadata: { topics: [], country_manager_id: currentUser?.id }
            });
            setIsOpen(false);
            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error('Error creating ADS:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
            {/* Header / Toggle */}
            <div className="p-3 bg-white flex flex-col items-start gap-1 max-w-[200px]">
                <h2 className="text-sm font-bold text-[#0B1221]">
                    {initialData ? 'Edit ADS' : 'Create ADS'}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isOpen ? 'bg-white border-2 border-[#00C44B]' : 'bg-[#EAEAEA]'}`}
                    >
                        <span
                            className={`${isOpen ? 'translate-x-4 bg-[#00C44B]' : 'translate-x-0.5 bg-white'} inline-block h-4 w-4 transform rounded-full transition-transform shadow-sm`}
                        />
                    </button>

                    {initialData && (
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    title: '',
                                    slug: '',
                                    content: '',
                                    link_url: '',
                                    image_url: '',
                                    location: currentUser?.work_country || '',
                                    metadata: { topics: [], country_manager_id: currentUser?.id }
                                });
                                setIsOpen(false);
                                if (onCancel) onCancel();
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Form Content */}
            {isOpen && (
                <form onSubmit={handleSubmit} className="p-6 bg-[#fffdf5]"> {/* Yellowish tint as requested */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Form Fields */}
                        <div className="lg:col-span-2 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2 px-3 border"
                                    placeholder="Ad Campaign Title"
                                />
                            </div>



                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
                                <textarea
                                    name="content"
                                    rows={3}
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2 px-3 border"
                                    placeholder="Describe your ad..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">Link to ADS</label>
                                <input
                                    type="url"
                                    name="link_url"
                                    required
                                    value={formData.link_url}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 py-2 px-3 border"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Presentation Image</label>
                                {formData.image_url ? (
                                    <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-gray-300 group">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full max-w-sm h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {isUploading ? (
                                                <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                    <p className="text-xs text-gray-500">Click to upload image</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Minings (Topics) */}
                        <div className="lg:col-span-1 border-l border-gray-200 pl-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                                Select Minings
                            </h3>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingTopics ? (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Loading minings...
                                    </div>
                                ) : topics.map(topic => (
                                    <label key={topic.id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.metadata.topics.includes(topic.id)
                                            ? 'bg-accent-500 border-accent-500'
                                            : 'border-gray-300 bg-white group-hover:border-accent-500'
                                            }`}>
                                            {formData.metadata.topics.includes(topic.id) && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.metadata.topics.includes(topic.id)}
                                            onChange={() => handleTopicToggle(topic.id)}
                                        />
                                        <span className={`text-sm ${formData.metadata.topics.includes(topic.id)
                                            ? 'text-gray-900 font-medium'
                                            : 'text-gray-600'
                                            }`}>
                                            {topic.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                * The AD will be visible in pages related to the selected minings.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.title || !formData.link_url}
                            className="bg-accent-500 hover:bg-accent-500/90 text-white font-bold py-2 px-4 text-sm rounded-lg shadow-sm transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : (initialData ? 'Update ADS' : 'Create ADS')}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

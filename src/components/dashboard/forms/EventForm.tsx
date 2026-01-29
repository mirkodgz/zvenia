import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function EventForm({ currentUser, initialData }: { currentUser: any, initialData?: any }) {
    // Helper to format "2026-06-24T00:00:00" -> "2026-06-24" for input type="date"
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        // Take first 10 chars (YYYY-MM-DD) which works for ISO strings
        return dateString.substring(0, 10);
    };

    // Lookup Data State
    const [topics, setTopics] = useState<any[]>([]);
    const [eventTypes, setEventTypes] = useState<any[]>([]);
    const [eventLanguages, setEventLanguages] = useState<any[]>([]);
    const [eventFormats, setEventFormats] = useState<any[]>([]);
    const [eventPrices, setEventPrices] = useState<any[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        title: initialData?.title || '',
        slug: initialData?.slug || '', // Added Slug
        description: initialData?.description || '',
        topic_id: initialData?.topic_slug || '',
        // Fix naming mismatch: DB uses 'type_id', form uses 'type_id', but lookup had 'event_type_id' check
        type_id: initialData?.type_id || initialData?.event_type_id || '',
        language_id: initialData?.language_id || initialData?.event_language_id || '',
        format_id: initialData?.format_id || initialData?.event_format_id || '',
        price_id: initialData?.price_id || initialData?.event_price_id || '',
        start_date: formatDateForInput(initialData?.start_date),
        end_date: formatDateForInput(initialData?.end_date),
        start_time: initialData?.start_time || '',
        location: initialData?.location || '',
        cover_photo_url: initialData?.featured_image_url || initialData?.cover_photo_url || '',
        schedule_pdf_url: initialData?.document_url || initialData?.metadata?.document_url || '',
        organizer: initialData?.organizer || initialData?.metadata?.organizer || '',
        organizer_phone: initialData?.organizer_phone || initialData?.metadata?.organizer_phone || '',
        organizer_email: initialData?.organizer_email || initialData?.metadata?.organizer_email || '',
        official_link: initialData?.external_link || '',
        is_popular: initialData?.is_popular || false
    });

    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false); // Track manual edits

    // Fetch All Options on Mount
    useEffect(() => {
        // ... (existing code)
        const fetchOptions = async () => {
            try {
                const [
                    { data: topicsData },
                    { data: typesData },
                    { data: languagesData },
                    { data: formatsData },
                    { data: pricesData }
                ] = await Promise.all([
                    supabase.from('topics').select('id, name, slug').order('name'),
                    supabase.from('event_types').select('*').order('name'),
                    supabase.from('event_languages').select('*').order('name'),
                    supabase.from('event_formats').select('*').order('name'),
                    supabase.from('event_prices').select('*').order('name')
                ]);

                setTopics(topicsData || []);
                setEventTypes(typesData || []);
                setEventLanguages(languagesData || []);
                setEventFormats(formatsData || []);
                setEventPrices(pricesData || []);
            } catch (error) {
                console.error("Error fetching event options:", error);
            } finally {
                setIsLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updates = { ...prev, [name]: value };

            // Auto-generate slug from title if not manually edited
            if (name === 'title' && !isSlugManuallyEdited && !prev.id) {
                updates.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
            }

            return updates;
        });

        if (name === 'slug') {
            setIsSlugManuallyEdited(true);
        }
    };

    // Generic File Upload Handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover_photo_url' | 'schedule_pdf_url') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (field === 'cover_photo_url' && !file.type.startsWith('image/')) {
            alert('Only images are allowed for the cover photo.');
            return;
        }
        if (field === 'schedule_pdf_url' && file.type !== 'application/pdf') {
            alert('Only PDF files are allowed for the schedule.');
            return;
        }

        setUploadingField(field);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Upload failed');

            let finalUrl = data.url;
            // For images misidentified as PDF (Cloudinary edge case), force JPG
            if (field === 'cover_photo_url' && data.format === 'pdf') {
                finalUrl = finalUrl.replace(/\.pdf$/i, '.jpg');
            }

            setFormData(prev => ({ ...prev, [field]: finalUrl }));
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload file');
        } finally {
            setUploadingField(null);
        }
    };

    // Submit Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isEdit = !!formData.id;
            const endpoint = isEdit ? '/api/content/update' : '/api/content/create';

            // Prepare Metadata (Legacy / Duplicate)
            const metadata = {
                organizer: formData.organizer,
                organizer_email: formData.organizer_email,
                organizer_phone: formData.organizer_phone
            };

            const payload = {
                ...formData,
                type: 'event', // Explicitly needed for update.ts differentiation
                featured_image_url: formData.cover_photo_url,
                document_url: formData.schedule_pdf_url,
                external_link: formData.official_link,
                // API expects prefixed names
                event_type_id: formData.type_id || null,
                event_language_id: formData.language_id || null,
                event_format_id: formData.format_id || null,
                event_price_id: formData.price_id || null,
                metadata: metadata,
                // Pass flat fields for events table
                organizer: formData.organizer,
                organizer_email: formData.organizer_email,
                organizer_phone: formData.organizer_phone
                // slug is included in ...formData
            };

            const body = isEdit ? payload : { type: 'event', data: payload };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save event');
            }

            alert(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
            // Redirect to Feed (Home) as requested
            window.location.href = '/';
        } catch (error: any) {
            console.error("Submission error:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingOptions) {
        return <div className="text-center py-12 text-gray-500">Loading form options...</div>;
    }

    const isEditMode = !!formData.id;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full mx-auto pb-12">

            {/* SECTION 1: BASIC INFO */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-(--text-main) border-b border-(--border-color) pb-2">Event Details</h3>

                {/* Topic Select */}
                <div>
                    <label className="block text-[15px] font-bold text-black mb-2">Topic *</label>
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
                    <label className="block text-[15px] font-bold text-black mb-2">Event Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. International Mining Congress 2026"
                        className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) focus:border-primary-500 outline-none"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-[15px] font-bold text-black mb-2">Event URL Slug *</label>
                    <div className="flex items-center">
                        <span className="bg-(--bg-surface) border border-r-0 border-(--border-color) rounded-l-lg px-3 py-3 text-gray-500 text-sm">
                            /event/
                        </span>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            placeholder="event-url-slug"
                            className="w-full bg-(--bg-body) border border-(--border-color) rounded-r-lg px-4 py-3 text-(--text-main) focus:border-primary-500 outline-none"
                        />
                    </div>
                    <p className="text-xs text-(--text-secondary) mt-1">This will be the unique link for your event.</p>
                </div>

                {/* Cover Photo */}
                <div>
                    <label className="block text-[15px] font-bold text-black mb-2">Event Cover Photo (1050x350 Recommended)</label>
                    {formData.cover_photo_url ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-(--border-color) group">
                            <img src={formData.cover_photo_url} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, cover_photo_url: '' }))} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">Remove Image</button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-(--border-color) rounded-lg p-8 text-center hover:border-primary-500/50 transition-colors bg-(--bg-body)">
                            {uploadingField === 'cover_photo_url' ? (
                                <span className="text-(--text-secondary)">Uploading...</span>
                            ) : (
                                <>
                                    <input type="file" id="cover-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover_photo_url')} />
                                    <label htmlFor="cover-upload" className="cursor-pointer text-primary-400 hover:text-primary-300">
                                        Click to upload image
                                    </label>
                                    <p className="text-xs text-(--text-secondary) mt-1">Recommended size: 1050 x 350 px</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION 2: DATE & LOCATION */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-(--text-main) border-b border-(--border-color) pb-2">Date & Location</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Start Date *</label>
                        <input type="date" name="start_date" required value={formData.start_date} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) scheme-dark dark:scheme-dark light:[color-scheme:light]" />
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">End Date *</label>
                        <input type="date" name="end_date" required value={formData.end_date} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) scheme-dark dark:scheme-dark light:[color-scheme:light]" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Start Time</label>
                        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) scheme-dark dark:scheme-dark light:[color-scheme:light]" />
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Location / Venue</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Lima Convention Center" className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main)" />
                    </div>
                </div>
            </div>

            {/* SECTION 3: CLASSIFICATION */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-(--text-main) border-b border-(--border-color) pb-2">Classification</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Event Type</label>
                        <select name="type_id" value={formData.type_id} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) appearance-none">
                            <option value="">Select Type</option>
                            {eventTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Format</label>
                        <select name="format_id" value={formData.format_id} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) appearance-none">
                            <option value="">Select Format</option>
                            {eventFormats.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Language</label>
                        <select name="language_id" value={formData.language_id} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) appearance-none">
                            <option value="">Select Language</option>
                            {eventLanguages.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Price Category</label>
                        <select name="price_id" value={formData.price_id} onChange={handleChange} className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main) appearance-none">
                            <option value="">Select Price</option>
                            {eventPrices.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION 4: ORGANIZER, LINKS & PDF */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-(--text-main) border-b border-(--border-color) pb-2">Resources & Organizer</h3>

                {/* PDF Schedule Upload */}
                <div>
                    <label className="block text-[15px] font-bold text-black mb-2">Event Program / Schedule (PDF) (Optional)</label>
                    {formData.schedule_pdf_url ? (
                        <div className="flex items-center justify-between p-3 bg-(--bg-surface) border border-(--border-color) rounded-lg">
                            <div className="flex items-center gap-2 text-primary-400">
                                <span>📄</span>
                                <a href={formData.schedule_pdf_url} target="_blank" className="text-sm hover:underline">View Uploaded Program</a>
                            </div>
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, schedule_pdf_url: '' }))} className="text-red-500 hover:text-red-400 text-sm">Remove</button>
                        </div>
                    ) : (
                        <div className="border border-dashed border-(--border-color) rounded-lg p-4 text-center hover:border-primary-500/50 transition-colors bg-(--bg-body)">
                            {uploadingField === 'schedule_pdf_url' ? (
                                <span className="text-(--text-secondary)">Uploading PDF...</span>
                            ) : (
                                <>
                                    <input type="file" id="pdf-upload" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'schedule_pdf_url')} />
                                    <label htmlFor="pdf-upload" className="cursor-pointer text-sm text-(--text-secondary) hover:text-(--text-main) flex items-center justify-center gap-2">
                                        <span>📎</span> Upload Program PDF
                                    </label>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Organizer Name</label>
                        <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} placeholder="Company or Group Name" className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main)" />
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Organizer Email</label>
                        <input type="email" name="organizer_email" value={formData.organizer_email} onChange={handleChange} placeholder="contact@organizer.com" className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main)" />
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Organizer Phone</label>
                        <input type="tel" name="organizer_phone" value={formData.organizer_phone} onChange={handleChange} placeholder="+1 234 567 890" className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main)" />
                    </div>
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">Official Event Link</label>
                        <input type="url" name="official_link" value={formData.official_link} onChange={handleChange} placeholder="https://..." className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-3 py-2 text-(--text-main)" />
                    </div>
                </div>
            </div>

            {/* Admin Only: Popular Event Toggle */}
            {(currentUser?.role === 'Administrator' || currentUser?.role === 'CountryManager') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_popular"
                        className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                        checked={(formData as any).is_popular}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                    />
                    <div>
                        <label htmlFor="is_popular" className="font-bold text-gray-800 block">Mark as Popular Event</label>
                        <p className="text-xs text-gray-600">Popular events appear on the Home Page feed.</p>
                    </div>
                </div>
            )}

            {/* SECTION 5: DESCRIPTION */}
            <div>
                <label className="block text-[15px] font-bold text-black mb-2">Full Description</label>
                <textarea
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-(--bg-body) border border-(--border-color) rounded-lg px-4 py-3 text-(--text-main) focus:border-primary-500 outline-none font-mono text-sm"
                    placeholder="Detailed information about the event..."
                />
            </div>

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
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#00c44b] py-3 px-8 text-sm font-bold text-white shadow-sm hover:bg-[#00c44b]/90 focus:outline-none transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Publish Event')}
                </button>
            </div>
        </form >
    );
}

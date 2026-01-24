import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface ProfileEditFormProps {
    currentUser: any;
    initialProfile: any;
}

export default function ProfileEditForm({ currentUser, initialProfile }: ProfileEditFormProps) {

    // Options State
    const [countries, setCountries] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        first_name: initialProfile?.first_name || '',
        last_name: initialProfile?.last_name || '',
        full_name: initialProfile?.full_name || '',
        headline_user: initialProfile?.headline_user || '',
        username: initialProfile?.username || '',
        phone_number: initialProfile?.phone_number || '',
        nationality: initialProfile?.nationality || '',
        current_location: initialProfile?.current_location || '',
        profession: initialProfile?.profession || '',
        company: initialProfile?.company || '',
        position: initialProfile?.position || '',
        work_country: initialProfile?.work_country || '',
        linkedin_url: initialProfile?.linkedin_url || '',
        main_language: initialProfile?.main_language || '',
        main_area_of_expertise: initialProfile?.main_area_of_expertise || '',
        avatar_url: initialProfile?.avatar_url || '',
    });

    // Metadata State (others_languages, others_areas_of_expertise)
    const [othersLanguages, setOthersLanguages] = useState<string[]>(
        (initialProfile?.metadata as any)?.others_languages || []
    );
    const [othersAreas, setOthersAreas] = useState<string[]>(
        (initialProfile?.metadata as any)?.others_areas_of_expertise || []
    );

    // Privacy Settings State
    const defaultPrivacy = {
        phone_number: false,      // Oculto por defecto
        email: false,              // Siempre oculto (no editable)
        nationality: true,         // Visible por defecto
        current_location: true,   // Visible por defecto
        company: true,            // Visible por defecto
        position: true,           // Visible por defecto
        linkedin_url: true,       // Visible por defecto
        profession: true,          // Visible por defecto
        work_country: true,       // Visible por defecto
        main_language: true,      // Visible por defecto
        others_languages: true,   // Visible por defecto
        main_area_of_expertise: true,  // Visible por defecto
        others_areas_of_expertise: true // Visible por defecto
    };
    const [privacySettings, setPrivacySettings] = useState<Record<string, boolean>>(
        (initialProfile?.metadata as any)?.privacy || defaultPrivacy
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Available languages
    const availableLanguages = ['Spanish', 'English', 'Russian', 'French'];

    // Load Options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Fetch countries
                const { data: countriesData } = await supabase
                    .from('countries')
                    .select('id, name, display_name')
                    .order('display_name');

                // Fetch topics
                const { data: topicsData } = await supabase
                    .from('topics')
                    .select('id, name, slug')
                    .order('name'); // Ordenar por name para que aparezcan en orden numérico (01, 02, 03...)

                setCountries(countriesData || []);
                setTopics(topicsData || []);
                setIsLoadingOptions(false);
            } catch (error) {
                console.error('Error loading options:', error);
                setIsLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Avatar Upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Only images are allowed for the avatar.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Upload failed');

            setFormData(prev => ({ ...prev, avatar_url: data.url }));
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload avatar');
        } finally {
            setIsUploading(false);
        }
    };

    // Others Languages (Multi-select)
    const toggleLanguage = (lang: string) => {
        setOthersLanguages(prev =>
            prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
        );
    };

    // Others Areas (Multi-select)
    const toggleArea = (areaSlug: string) => {
        setOthersAreas(prev =>
            prev.includes(areaSlug) ? prev.filter(a => a !== areaSlug) : [...prev, areaSlug]
        );
    };

    // Privacy Settings Toggle
    const togglePrivacy = (field: string) => {
        setPrivacySettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Validate LinkedIn URL
    const validateLinkedInURL = (url: string): string | null => {
        if (!url || url.trim() === '') {
            return null; // Optional field
        }

        const trimmed = url.trim();

        // Si no empieza con http:// o https://, agregar https://
        let normalizedUrl = trimmed;
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            normalizedUrl = `https://${trimmed}`;
        }

        // Validar que sea una URL válida de LinkedIn
        try {
            const urlObj = new URL(normalizedUrl);
            const hostname = urlObj.hostname.toLowerCase();

            // Aceptar linkedin.com o www.linkedin.com
            if (!hostname.includes('linkedin.com')) {
                return 'LinkedIn URL must be from linkedin.com domain. Example: https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile';
            }

            // Validar formato básico de perfil de LinkedIn
            if (!urlObj.pathname.includes('/in/') && !urlObj.pathname.includes('/company/')) {
                return 'LinkedIn URL must be a profile (e.g., /in/username) or company page. Example: https://linkedin.com/in/yourprofile';
            }

            return null; // Válido
        } catch (e) {
            return 'Invalid URL format. Please use a valid LinkedIn URL. Example: https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile';
        }
    };

    // Validate form before submission
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validar LinkedIn URL
        const linkedinError = validateLinkedInURL(formData.linkedin_url);
        if (linkedinError) {
            errors.linkedin_url = linkedinError;
        }

        setFieldErrors(errors);

        // Si hay errores, hacer scroll al primer campo con error
        if (Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (errorElement as HTMLElement).focus();
            }
            return false;
        }

        return true;
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');
        setFieldErrors({});

        // Validar formulario antes de enviar
        if (!validateForm()) {
            setIsSubmitting(false);
            setErrorMessage('Please fix the errors below before saving.');
            return;
        }

        try {
            // Normalizar LinkedIn URL si es necesario
            let linkedinUrl = formData.linkedin_url;
            if (linkedinUrl && linkedinUrl.trim() !== '') {
                const trimmed = linkedinUrl.trim();
                if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
                    linkedinUrl = `https://${trimmed}`;
                }
            }

            // Prepare metadata
            const metadata = {
                ...(initialProfile?.metadata || {}),
                others_languages: othersLanguages,
                others_areas_of_expertise: othersAreas,
                privacy: privacySettings,
            };

            // Prepare update data
            const updateData = {
                ...formData,
                linkedin_url: linkedinUrl,
                metadata,
            };

            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Si el error viene del servidor, intentar identificar el campo
                const serverError = result.error || 'Failed to update profile';
                
                // Intentar extraer el campo del error si es posible
                if (serverError.toLowerCase().includes('linkedin')) {
                    setFieldErrors({ linkedin_url: serverError });
                    const linkedinField = document.querySelector('[name="linkedin_url"]');
                    if (linkedinField) {
                        linkedinField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        (linkedinField as HTMLElement).focus();
                    }
                }
                
                throw new Error(serverError);
            }

            setSuccessMessage('Profile updated successfully!');
            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = '/dashboard/profile';
            }, 1500);
        } catch (error: any) {
            console.error('Update error:', error);
            setErrorMessage(error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingOptions) {
        return <div className="text-center py-12 text-gray-500">Loading form options...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-[#202124] mb-1">Edit Your Profile</h2>
                <p className="text-sm text-gray-600">Update your personal and professional information.</p>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {errorMessage}
                </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                            placeholder="Auto-generated from first and last name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">
                        Headline
                    </label>
                    <input
                        type="text"
                        name="headline_user"
                        value={formData.headline_user}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        placeholder="e.g. Senior Mining Engineer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={initialProfile?.email || ''}
                        disabled
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Nationality
                        </label>
                        <select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        >
                            <option value="">Select Nationality</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.display_name}>
                                    {country.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">
                        Current Location
                    </label>
                    <input
                        type="text"
                        name="current_location"
                        value={formData.current_location}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        placeholder="e.g. Santiago, Chile"
                    />
                </div>
            </div>

            {/* Section 3: Professional Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
                    Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Profession
                        </label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                            placeholder="e.g. Mining Engineer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Work Country
                        </label>
                        <select
                            name="work_country"
                            value={formData.work_country}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        >
                            <option value="">Select Work Country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.display_name}>
                                    {country.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Current Company
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Current Position
                        </label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#202124] mb-2">
                        LinkedIn URL
                    </label>
                    <input
                        type="text"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={(e) => {
                            handleChange(e);
                            // Limpiar error cuando el usuario empiece a escribir
                            if (fieldErrors.linkedin_url) {
                                setFieldErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.linkedin_url;
                                    return newErrors;
                                });
                            }
                        }}
                        className={`w-full bg-white border rounded-lg px-4 py-3 text-[#202124] focus:ring-1 outline-none ${
                            fieldErrors.linkedin_url 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-[#00c44b] focus:ring-[#00c44b]'
                        }`}
                        placeholder="https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile"
                    />
                    {fieldErrors.linkedin_url && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {fieldErrors.linkedin_url}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        You can enter with or without https:// (e.g., www.linkedin.com/in/yourprofile)
                    </p>
                </div>
            </div>

            {/* Section 4: Language & Expertise */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
                    Language & Expertise
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Main Language
                        </label>
                        <select
                            name="main_language"
                            value={formData.main_language}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        >
                            <option value="">Select Main Language</option>
                            {availableLanguages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Other Languages
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableLanguages.map(lang => (
                                <label
                                    key={lang}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={othersLanguages.includes(lang)}
                                        onChange={() => toggleLanguage(lang)}
                                        className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                                    />
                                    <span className="text-sm text-[#202124]">{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Main Area of Expertise
                        </label>
                        <select
                            name="main_area_of_expertise"
                            value={formData.main_area_of_expertise}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
                        >
                            <option value="">Select Main Area</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.slug}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Other Areas of Expertise
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                            <div className="space-y-2">
                                {topics.map(topic => (
                                    <label
                                        key={topic.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={othersAreas.includes(topic.slug)}
                                            onChange={() => toggleArea(topic.slug)}
                                            className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                                        />
                                        <span className="text-sm text-[#202124]">{topic.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 5: Profile Picture */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
                    Profile Picture
                </h3>

                <div className="flex items-center gap-6">
                    {formData.avatar_url ? (
                        <img
                            src={formData.avatar_url}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <span className="text-gray-400 text-2xl">👤</span>
                        </div>
                    )}

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[#202124] mb-2">
                            Change Photo
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarUpload}
                            disabled={isUploading}
                            className="block w-full text-sm text-[#202124] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00c44b] file:text-white hover:file:bg-[#00a03d] cursor-pointer disabled:opacity-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG or WEBP. Max size 5MB.
                        </p>
                        {isUploading && (
                            <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 6: Privacy Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
                    Privacy Settings
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Control what information is visible on your public profile. Your name, photo, and headline are always visible.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#202124] mb-2">Contact Information</h4>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.phone_number}
                                onChange={() => togglePrivacy('phone_number')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show phone number</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer opacity-50 cursor-not-allowed">
                            <input
                                type="checkbox"
                                checked={false}
                                disabled
                                className="w-4 h-4 text-gray-300 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-500">Show email (always hidden for security)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.nationality}
                                onChange={() => togglePrivacy('nationality')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show nationality</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.current_location}
                                onChange={() => togglePrivacy('current_location')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show current location</span>
                        </label>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#202124] mb-2">Professional Information</h4>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.company}
                                onChange={() => togglePrivacy('company')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show company</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.position}
                                onChange={() => togglePrivacy('position')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show position</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.linkedin_url}
                                onChange={() => togglePrivacy('linkedin_url')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show LinkedIn URL</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.profession}
                                onChange={() => togglePrivacy('profession')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show profession</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.work_country}
                                onChange={() => togglePrivacy('work_country')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show work country</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[#202124] mb-2">Language & Expertise</h4>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.main_language}
                                onChange={() => togglePrivacy('main_language')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show main language</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.others_languages}
                                onChange={() => togglePrivacy('others_languages')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show other languages</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.main_area_of_expertise}
                                onChange={() => togglePrivacy('main_area_of_expertise')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show main area of expertise</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacySettings.others_areas_of_expertise}
                                onChange={() => togglePrivacy('others_areas_of_expertise')}
                                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                            />
                            <span className="text-sm text-[#202124]">Show other areas of expertise</span>
                        </label>
                    </div>
                </div>

                {/* Public Profile Link */}
                {initialProfile?.profile_slug && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Your Public Profile</p>
                        <p className="text-xs text-blue-700 mb-2">
                            Share this link to let others view your public profile:
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${initialProfile.profile_slug}/zv-user/`}
                                className="flex-1 bg-white border border-blue-300 rounded px-3 py-2 text-sm text-gray-700"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const url = `${window.location.origin}/profile/${initialProfile.profile_slug}/zv-user/`;
                                    navigator.clipboard.writeText(url);
                                    alert('Link copied to clipboard!');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                                Copy
                            </button>
                            <a
                                href={`/profile/${initialProfile.profile_slug}/zv-user/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                                Preview
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#00c44b] text-white font-semibold rounded-lg hover:bg-[#00a03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <a
                    href="/dashboard/profile"
                    className="px-6 py-3 bg-gray-200 text-[#202124] font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </a>
            </div>
        </form>
    );
}


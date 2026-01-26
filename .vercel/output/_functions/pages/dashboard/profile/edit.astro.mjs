import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../../chunks/LeftSidebar_DEdUkq9E.mjs';
import { s as supabase, c as createSupabaseServerClient } from '../../../chunks/supabase_DZBRYQhj.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
export { renderers } from '../../../renderers.mjs';

function ProfileEditForm({ currentUser, initialProfile }) {
  const [countries, setCountries] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [formData, setFormData] = useState({
    first_name: initialProfile?.first_name || "",
    last_name: initialProfile?.last_name || "",
    full_name: initialProfile?.full_name || "",
    headline_user: initialProfile?.headline_user || "",
    username: initialProfile?.username || "",
    phone_number: initialProfile?.phone_number || "",
    nationality: initialProfile?.nationality || "",
    current_location: initialProfile?.current_location || "",
    profession: initialProfile?.profession || "",
    company: initialProfile?.company || "",
    position: initialProfile?.position || "",
    work_country: initialProfile?.work_country || "",
    linkedin_url: initialProfile?.linkedin_url || "",
    main_language: initialProfile?.main_language || "",
    main_area_of_expertise: initialProfile?.main_area_of_expertise || "",
    avatar_url: initialProfile?.avatar_url || ""
  });
  const [othersLanguages, setOthersLanguages] = useState(
    initialProfile?.metadata?.others_languages || []
  );
  const [othersAreas, setOthersAreas] = useState(
    initialProfile?.metadata?.others_areas_of_expertise || []
  );
  const defaultPrivacy = {
    phone_number: false,
    // Oculto por defecto
    email: false,
    // Siempre oculto (no editable)
    nationality: true,
    // Visible por defecto
    current_location: true,
    // Visible por defecto
    company: true,
    // Visible por defecto
    position: true,
    // Visible por defecto
    linkedin_url: true,
    // Visible por defecto
    profession: true,
    // Visible por defecto
    work_country: true,
    // Visible por defecto
    main_language: true,
    // Visible por defecto
    others_languages: true,
    // Visible por defecto
    main_area_of_expertise: true,
    // Visible por defecto
    others_areas_of_expertise: true
    // Visible por defecto
  };
  const [privacySettings, setPrivacySettings] = useState(
    initialProfile?.metadata?.privacy || defaultPrivacy
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const availableLanguages = ["Spanish", "English", "Russian", "French"];
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data: countriesData } = await supabase.from("countries").select("id, name, display_name").order("display_name");
        const { data: topicsData } = await supabase.from("topics").select("id, name, slug").order("name");
        setCountries(countriesData || []);
        setTopics(topicsData || []);
        setIsLoadingOptions(false);
      } catch (error) {
        console.error("Error loading options:", error);
        setIsLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only images are allowed for the avatar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setFormData((prev) => ({ ...prev, avatar_url: data.url }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };
  const toggleLanguage = (lang) => {
    setOthersLanguages(
      (prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };
  const toggleArea = (areaSlug) => {
    setOthersAreas(
      (prev) => prev.includes(areaSlug) ? prev.filter((a) => a !== areaSlug) : [...prev, areaSlug]
    );
  };
  const togglePrivacy = (field) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const validateLinkedInURL = (url) => {
    if (!url || url.trim() === "") {
      return null;
    }
    const trimmed = url.trim();
    let normalizedUrl = trimmed;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      normalizedUrl = `https://${trimmed}`;
    }
    try {
      const urlObj = new URL(normalizedUrl);
      const hostname = urlObj.hostname.toLowerCase();
      if (!hostname.includes("linkedin.com")) {
        return "LinkedIn URL must be from linkedin.com domain. Example: https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile";
      }
      if (!urlObj.pathname.includes("/in/") && !urlObj.pathname.includes("/company/")) {
        return "LinkedIn URL must be a profile (e.g., /in/username) or company page. Example: https://linkedin.com/in/yourprofile";
      }
      return null;
    } catch (e) {
      return "Invalid URL format. Please use a valid LinkedIn URL. Example: https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile";
    }
  };
  const validateForm = () => {
    const errors = {};
    const linkedinError = validateLinkedInURL(formData.linkedin_url);
    if (linkedinError) {
      errors.linkedin_url = linkedinError;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});
    if (!validateForm()) {
      setIsSubmitting(false);
      setErrorMessage("Please fix the errors below before saving.");
      return;
    }
    try {
      let linkedinUrl = formData.linkedin_url;
      if (linkedinUrl && linkedinUrl.trim() !== "") {
        const trimmed = linkedinUrl.trim();
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
          linkedinUrl = `https://${trimmed}`;
        }
      }
      const metadata = {
        ...initialProfile?.metadata || {},
        others_languages: othersLanguages,
        others_areas_of_expertise: othersAreas,
        privacy: privacySettings
      };
      const updateData = {
        ...formData,
        linkedin_url: linkedinUrl,
        metadata
      };
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });
      const result = await response.json();
      if (!response.ok) {
        const serverError = result.error || "Failed to update profile";
        if (serverError.toLowerCase().includes("linkedin")) {
          setFieldErrors({ linkedin_url: serverError });
          const linkedinField = document.querySelector('[name="linkedin_url"]');
          if (linkedinField) {
            linkedinField.scrollIntoView({ behavior: "smooth", block: "center" });
            linkedinField.focus();
          }
        }
        throw new Error(serverError);
      }
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        window.location.href = "/dashboard/profile";
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoadingOptions) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500", children: "Loading form options..." });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 max-w-4xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-200 pb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[#202124] mb-1", children: "Edit Your Profile" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Update your personal and professional information." })
    ] }),
    successMessage && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg", children: successMessage }),
    errorMessage && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg", children: errorMessage }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2", children: "Basic Information" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "First Name *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "first_name",
              required: true,
              value: formData.first_name,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Last Name *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "last_name",
              required: true,
              value: formData.last_name,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Full Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "full_name",
              value: formData.full_name,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
              placeholder: "Auto-generated from first and last name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Username" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "username",
              value: formData.username,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Headline" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "headline_user",
            value: formData.headline_user,
            onChange: handleChange,
            className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
            placeholder: "e.g. Senior Mining Engineer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: initialProfile?.email || "",
            disabled: true,
            className: "w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Email cannot be changed" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2", children: "Contact Information" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Phone Number" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "tel",
              name: "phone_number",
              value: formData.phone_number,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Nationality" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "nationality",
              value: formData.nationality,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Nationality" }),
                countries.map((country) => /* @__PURE__ */ jsx("option", { value: country.display_name, children: country.display_name }, country.id))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Current Location" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "current_location",
            value: formData.current_location,
            onChange: handleChange,
            className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
            placeholder: "e.g. Santiago, Chile"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2", children: "Professional Information" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Profession" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "profession",
              value: formData.profession,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
              placeholder: "e.g. Mining Engineer"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Work Country" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "work_country",
              value: formData.work_country,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Work Country" }),
                countries.map((country) => /* @__PURE__ */ jsx("option", { value: country.display_name, children: country.display_name }, country.id))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Current Company" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "company",
              value: formData.company,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Current Position" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "position",
              value: formData.position,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "LinkedIn URL" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "linkedin_url",
            value: formData.linkedin_url,
            onChange: (e) => {
              handleChange(e);
              if (fieldErrors.linkedin_url) {
                setFieldErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.linkedin_url;
                  return newErrors;
                });
              }
            },
            className: `w-full bg-white border rounded-lg px-4 py-3 text-[#202124] focus:ring-1 outline-none ${fieldErrors.linkedin_url ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#00c44b] focus:ring-[#00c44b]"}`,
            placeholder: "https://linkedin.com/in/yourprofile or www.linkedin.com/in/yourprofile"
          }
        ),
        fieldErrors.linkedin_url && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
          fieldErrors.linkedin_url
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "You can enter with or without https:// (e.g., www.linkedin.com/in/yourprofile)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2", children: "Language & Expertise" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Main Language" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "main_language",
              value: formData.main_language,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Main Language" }),
                availableLanguages.map((lang) => /* @__PURE__ */ jsx("option", { value: lang, children: lang }, lang))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Other Languages" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: availableLanguages.map((lang) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-2 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: othersLanguages.includes(lang),
                    onChange: () => toggleLanguage(lang),
                    className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: lang })
              ]
            },
            lang
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Main Area of Expertise" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "main_area_of_expertise",
              value: formData.main_area_of_expertise,
              onChange: handleChange,
              className: "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#202124] focus:border-[#00c44b] focus:ring-1 focus:ring-[#00c44b] outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Main Area" }),
                topics.map((topic) => /* @__PURE__ */ jsx("option", { value: topic.slug, children: topic.name }, topic.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Other Areas of Expertise" }),
          /* @__PURE__ */ jsx("div", { className: "max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: topics.map((topic) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-2 cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: othersAreas.includes(topic.slug),
                    onChange: () => toggleArea(topic.slug),
                    className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: topic.name })
              ]
            },
            topic.id
          )) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2", children: "Profile Picture" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        formData.avatar_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: formData.avatar_url,
            alt: "Avatar",
            className: "w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300", children: /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-2xl", children: "👤" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#202124] mb-2", children: "Change Photo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/jpeg,image/png,image/webp",
              onChange: handleAvatarUpload,
              disabled: isUploading,
              className: "block w-full text-sm text-[#202124] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00c44b] file:text-white hover:file:bg-[#00a03d] cursor-pointer disabled:opacity-50"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "JPG, PNG or WEBP. Max size 5MB." }),
          isUploading && /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 mt-1", children: "Uploading..." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2", children: "Privacy Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Control what information is visible on your public profile. Your name, photo, and headline are always visible." }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-[#202124] mb-2", children: "Contact Information" }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.phone_number,
                onChange: () => togglePrivacy("phone_number"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show phone number" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer opacity-50 cursor-not-allowed", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: false,
                disabled: true,
                className: "w-4 h-4 text-gray-300 border-gray-300 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Show email (always hidden for security)" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.nationality,
                onChange: () => togglePrivacy("nationality"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show nationality" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.current_location,
                onChange: () => togglePrivacy("current_location"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show current location" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-[#202124] mb-2", children: "Professional Information" }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.company,
                onChange: () => togglePrivacy("company"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show company" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.position,
                onChange: () => togglePrivacy("position"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show position" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.linkedin_url,
                onChange: () => togglePrivacy("linkedin_url"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show LinkedIn URL" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.profession,
                onChange: () => togglePrivacy("profession"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show profession" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: privacySettings.work_country,
                onChange: () => togglePrivacy("work_country"),
                className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show work country" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-[#202124] mb-2", children: "Language & Expertise" }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: privacySettings.main_language,
              onChange: () => togglePrivacy("main_language"),
              className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show main language" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: privacySettings.others_languages,
              onChange: () => togglePrivacy("others_languages"),
              className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show other languages" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: privacySettings.main_area_of_expertise,
              onChange: () => togglePrivacy("main_area_of_expertise"),
              className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show main area of expertise" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: privacySettings.others_areas_of_expertise,
              onChange: () => togglePrivacy("others_areas_of_expertise"),
              className: "w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-[#202124]", children: "Show other areas of expertise" })
        ] })
      ] }) }),
      initialProfile?.profile_slug && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-900 mb-2", children: "Your Public Profile" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-700 mb-2", children: "Share this link to let others view your public profile:" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              readOnly: true,
              value: `${typeof window !== "undefined" ? window.location.origin : ""}/profile/${initialProfile.profile_slug}/zv-user/`,
              className: "flex-1 bg-white border border-blue-300 rounded px-3 py-2 text-sm text-gray-700",
              onClick: (e) => e.target.select()
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                const url = `${window.location.origin}/profile/${initialProfile.profile_slug}/zv-user/`;
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
              },
              className: "px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors",
              children: "Copy"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `/profile/${initialProfile.profile_slug}/zv-user/`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors",
              children: "Preview"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-6 border-t border-gray-200", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isSubmitting,
          className: "px-6 py-3 bg-[#00c44b] text-white font-semibold rounded-lg hover:bg-[#00a03d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: isSubmitting ? "Saving..." : "Save Changes"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/dashboard/profile",
          className: "px-6 py-3 bg-gray-200 text-[#202124] font-semibold rounded-lg hover:bg-gray-300 transition-colors",
          children: "Cancel"
        }
      )
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profileError) {
    console.error("[Settings] Error fetching profile:", profileError);
    return Astro2.redirect("/dashboard/profile?error=profile_not_found");
  }
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "Edit Profile", "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-5xl mx-auto py-8 px-4"> ${renderComponent($$result2, "ProfileEditForm", ProfileEditForm, { "client:load": true, "currentUser": user, "initialProfile": profile, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/dashboard/forms/ProfileEditForm.tsx", "client:component-export": "default" })} </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/dashboard/profile/edit.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/dashboard/profile/edit.astro";
const $$url = "/dashboard/profile/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Edit,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

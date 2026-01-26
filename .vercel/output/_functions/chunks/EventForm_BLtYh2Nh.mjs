import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_DZBRYQhj.mjs';

function EventForm({ currentUser, initialData }) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  };
  const [topics, setTopics] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventLanguages, setEventLanguages] = useState([]);
  const [eventFormats, setEventFormats] = useState([]);
  const [eventPrices, setEventPrices] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    // Added Slug
    description: initialData?.description || "",
    topic_id: initialData?.topic_slug || "",
    // Fix naming mismatch: DB uses 'type_id', form uses 'type_id', but lookup had 'event_type_id' check
    type_id: initialData?.type_id || initialData?.event_type_id || "",
    language_id: initialData?.language_id || initialData?.event_language_id || "",
    format_id: initialData?.format_id || initialData?.event_format_id || "",
    price_id: initialData?.price_id || initialData?.event_price_id || "",
    start_date: formatDateForInput(initialData?.start_date),
    end_date: formatDateForInput(initialData?.end_date),
    start_time: initialData?.start_time || "",
    location: initialData?.location || "",
    cover_photo_url: initialData?.featured_image_url || initialData?.cover_photo_url || "",
    schedule_pdf_url: initialData?.document_url || initialData?.metadata?.document_url || "",
    organizer: initialData?.organizer || initialData?.metadata?.organizer || "",
    organizer_phone: initialData?.organizer_phone || initialData?.metadata?.organizer_phone || "",
    organizer_email: initialData?.organizer_email || initialData?.metadata?.organizer_email || "",
    official_link: initialData?.external_link || ""
  });
  const [uploadingField, setUploadingField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          { data: topicsData },
          { data: typesData },
          { data: languagesData },
          { data: formatsData },
          { data: pricesData }
        ] = await Promise.all([
          supabase.from("topics").select("id, name, slug").order("slug"),
          supabase.from("event_types").select("*").order("name"),
          supabase.from("event_languages").select("*").order("name"),
          supabase.from("event_formats").select("*").order("name"),
          supabase.from("event_prices").select("*").order("name")
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updates = { ...prev, [name]: value };
      if (name === "title" && !isSlugManuallyEdited && !prev.id) {
        updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return updates;
    });
    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }
  };
  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === "cover_photo_url" && !file.type.startsWith("image/")) {
      alert("Only images are allowed for the cover photo.");
      return;
    }
    if (field === "schedule_pdf_url" && file.type !== "application/pdf") {
      alert("Only PDF files are allowed for the schedule.");
      return;
    }
    setUploadingField(field);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      let finalUrl = data.url;
      if (field === "cover_photo_url" && data.format === "pdf") {
        finalUrl = finalUrl.replace(/\.pdf$/i, ".jpg");
      }
      setFormData((prev) => ({ ...prev, [field]: finalUrl }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload file");
    } finally {
      setUploadingField(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!formData.id;
      const endpoint = isEdit ? "/api/content/update" : "/api/content/create";
      const metadata = {
        organizer: formData.organizer,
        organizer_email: formData.organizer_email,
        organizer_phone: formData.organizer_phone
      };
      const payload = {
        ...formData,
        type: "event",
        // Explicitly needed for update.ts differentiation
        featured_image_url: formData.cover_photo_url,
        document_url: formData.schedule_pdf_url,
        external_link: formData.official_link,
        // API expects prefixed names
        event_type_id: formData.type_id || null,
        event_language_id: formData.language_id || null,
        event_format_id: formData.format_id || null,
        event_price_id: formData.price_id || null,
        metadata,
        // Pass flat fields for events table
        organizer: formData.organizer,
        organizer_email: formData.organizer_email,
        organizer_phone: formData.organizer_phone
        // slug is included in ...formData
      };
      const body = isEdit ? payload : { type: "event", data: payload };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to save event");
      }
      alert(isEdit ? "Event updated successfully!" : "Event created successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoadingOptions) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500", children: "Loading form options..." });
  }
  const isEditMode = !!formData.id;
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 max-w-4xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2", children: "Event Details" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Topic *" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            name: "topic_id",
            value: formData.topic_id,
            onChange: handleChange,
            required: true,
            className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none focus:border-primary-500 outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a Topic" }),
              topics.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.name }, t.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Event Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "title",
            value: formData.title,
            onChange: handleChange,
            required: true,
            placeholder: "e.g. International Mining Congress 2026",
            className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Event URL Slug *" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-[var(--bg-surface)] border border-r-0 border-[var(--border-color)] rounded-l-lg px-3 py-3 text-gray-500 text-sm", children: "/event/" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "slug",
              value: formData.slug,
              onChange: handleChange,
              required: true,
              placeholder: "event-url-slug",
              className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-r-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-secondary)] mt-1", children: "This will be the unique link for your event." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Event Cover Photo (1050x350 Recommended)" }),
        formData.cover_photo_url ? /* @__PURE__ */ jsxs("div", { className: "relative w-full h-48 rounded-lg overflow-hidden border border-[var(--border-color)] group", children: [
          /* @__PURE__ */ jsx("img", { src: formData.cover_photo_url, alt: "Cover", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, cover_photo_url: "" })), className: "bg-red-600 text-white px-3 py-1 rounded-full text-sm", children: "Remove Image" }) })
        ] }) : /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center hover:border-primary-500/50 transition-colors bg-[var(--bg-body)]", children: uploadingField === "cover_photo_url" ? /* @__PURE__ */ jsx("span", { className: "text-[var(--text-secondary)]", children: "Uploading..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("input", { type: "file", id: "cover-upload", className: "hidden", accept: "image/*", onChange: (e) => handleFileUpload(e, "cover_photo_url") }),
          /* @__PURE__ */ jsx("label", { htmlFor: "cover-upload", className: "cursor-pointer text-primary-400 hover:text-primary-300", children: "Click to upload image" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-secondary)] mt-1", children: "Recommended size: 1050 x 350 px" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2", children: "Date & Location" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Start Date *" }),
          /* @__PURE__ */ jsx("input", { type: "date", name: "start_date", required: true, value: formData.start_date, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] [color-scheme:dark] dark:[color-scheme:dark] light:[color-scheme:light]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "End Date *" }),
          /* @__PURE__ */ jsx("input", { type: "date", name: "end_date", required: true, value: formData.end_date, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] [color-scheme:dark] dark:[color-scheme:dark] light:[color-scheme:light]" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Start Time" }),
          /* @__PURE__ */ jsx("input", { type: "time", name: "start_time", value: formData.start_time, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] [color-scheme:dark] dark:[color-scheme:dark] light:[color-scheme:light]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Location / Venue" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "location", value: formData.location, onChange: handleChange, placeholder: "e.g. Lima Convention Center", className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)]" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2", children: "Classification" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Event Type" }),
          /* @__PURE__ */ jsxs("select", { name: "type_id", value: formData.type_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Type" }),
            eventTypes.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.name }, t.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Format" }),
          /* @__PURE__ */ jsxs("select", { name: "format_id", value: formData.format_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Format" }),
            eventFormats.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.name }, t.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Language" }),
          /* @__PURE__ */ jsxs("select", { name: "language_id", value: formData.language_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Language" }),
            eventLanguages.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.name }, t.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Price Category" }),
          /* @__PURE__ */ jsxs("select", { name: "price_id", value: formData.price_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Price" }),
            eventPrices.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.name }, t.id))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2", children: "Resources & Organizer" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Event Program / Schedule (PDF) (Optional)" }),
        formData.schedule_pdf_url ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary-400", children: [
            /* @__PURE__ */ jsx("span", { children: "📄" }),
            /* @__PURE__ */ jsx("a", { href: formData.schedule_pdf_url, target: "_blank", className: "text-sm hover:underline", children: "View Uploaded Program" })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, schedule_pdf_url: "" })), className: "text-red-500 hover:text-red-400 text-sm", children: "Remove" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "border border-dashed border-[var(--border-color)] rounded-lg p-4 text-center hover:border-primary-500/50 transition-colors bg-[var(--bg-body)]", children: uploadingField === "schedule_pdf_url" ? /* @__PURE__ */ jsx("span", { className: "text-[var(--text-secondary)]", children: "Uploading PDF..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("input", { type: "file", id: "pdf-upload", className: "hidden", accept: "application/pdf", onChange: (e) => handleFileUpload(e, "schedule_pdf_url") }),
          /* @__PURE__ */ jsxs("label", { htmlFor: "pdf-upload", className: "cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { children: "📎" }),
            " Upload Program PDF"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Organizer Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "organizer", value: formData.organizer, onChange: handleChange, placeholder: "Company or Group Name", className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Organizer Email" }),
          /* @__PURE__ */ jsx("input", { type: "email", name: "organizer_email", value: formData.organizer_email, onChange: handleChange, placeholder: "contact@organizer.com", className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Organizer Phone" }),
          /* @__PURE__ */ jsx("input", { type: "tel", name: "organizer_phone", value: formData.organizer_phone, onChange: handleChange, placeholder: "+1 234 567 890", className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Official Event Link" }),
          /* @__PURE__ */ jsx("input", { type: "url", name: "official_link", value: formData.official_link, onChange: handleChange, placeholder: "https://...", className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)]" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Full Description" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          name: "description",
          rows: 6,
          value: formData.description,
          onChange: handleChange,
          className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none font-mono text-sm",
          placeholder: "Detailed information about the event..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-[var(--border-color)] flex justify-end", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => window.location.href = "/",
          className: "mr-3 inline-flex justify-center rounded-md border border-[var(--border-color)] bg-transparent py-3 px-8 text-sm font-medium text-[var(--text-secondary)] shadow-sm hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] focus:outline-none transition-all",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isSubmitting,
          className: "inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-3 px-8 text-sm font-bold text-white shadow-sm hover:bg-primary-500 focus:outline-none transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
          children: isSubmitting ? "Saving..." : isEditMode ? "💾 Update Event" : "🚀 Publish Event"
        }
      )
    ] })
  ] });
}

export { EventForm as E };

import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_DZBRYQhj.mjs';

function ServiceForm({ currentUser, initialData }) {
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [types, setTypes] = useState([]);
  const [durations, setDurations] = useState([]);
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    topic_id: initialData?.topic_id || "",
    type_id: initialData?.type_id || "",
    duration_id: initialData?.duration_id || "",
    target_country: initialData?.target_country || "",
    organizer_company: initialData?.organizer_company || "",
    company_link: initialData?.company_link || "",
    contact_email: initialData?.contact_email || "",
    quick_view_image_url: initialData?.quick_view_image_url || initialData?.featured_image_url || ""
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
          supabase.from("service_types").select("*").order("name"),
          supabase.from("service_durations").select("*").order("name"),
          supabase.from("topics").select("id, name, slug").order("name")
        ]);
        setTypes(typesData || []);
        setDurations(durationsData || []);
        setTopics(topicsData || []);
      } catch (err) {
        console.error("Error fetching options:", err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFormData((prev) => ({ ...prev, quick_view_image_url: data.url }));
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!formData.id;
      const endpoint = isEdit ? "/api/content/update" : "/api/content/create";
      const payload = {
        ...formData,
        type: "service",
        // For API to distinguish
        featured_image_url: formData.quick_view_image_url
        // Map to standard field
      };
      const body = isEdit ? payload : { type: "service", data: payload };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error("Failed to save service");
      alert(isEdit ? "Service updated!" : "Service created!");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoadingOptions) return /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-gray-500", children: "Loading options..." });
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 max-w-4xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-b border-[var(--border-color)] pb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[var(--text-main)] mb-1", children: formData.id ? "Edit Service" : "Create New Service" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--text-secondary)]", children: "Promote your services to the Zvenia community." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)]", children: "Basic Information" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Service Title *" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "title", required: true, value: formData.title, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none", placeholder: "e.g. Geological Consulting" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Topic *" }),
          /* @__PURE__ */ jsxs("select", { name: "topic_id", required: true, value: formData.topic_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Topic" }),
            topics.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.name }, t.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Description" }),
        /* @__PURE__ */ jsx("textarea", { name: "description", rows: 4, value: formData.description, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] outline-none", placeholder: "Describe your service..." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)]", children: "Classification" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Type of Ad *" }),
          /* @__PURE__ */ jsxs("select", { name: "type_id", required: true, value: formData.type_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Type" }),
            types.map((t) => /* @__PURE__ */ jsx("option", { value: t.id, children: t.name }, t.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Campaign Duration" }),
          /* @__PURE__ */ jsxs("select", { name: "duration_id", value: formData.duration_id, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Duration" }),
            durations.map((d) => /* @__PURE__ */ jsx("option", { value: d.id, children: d.name }, d.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Target Country" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "target_country", value: formData.target_country, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)]", placeholder: "e.g. Peru" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)]", children: "Visuals" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Quick View Image (Card)" }),
        formData.quick_view_image_url ? /* @__PURE__ */ jsxs("div", { className: "relative w-48 h-32 rounded bg-gray-800 overflow-hidden border border-[var(--border-color)] group", children: [
          /* @__PURE__ */ jsx("img", { src: formData.quick_view_image_url, className: "w-full h-full object-cover" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, quick_view_image_url: "" })), className: "absolute inset-0 bg-black/50 text-red-500 opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold", children: "Remove" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg flex items-center justify-center hover:border-primary-500/50 transition-colors", children: /* @__PURE__ */ jsxs("label", { className: "cursor-pointer text-[var(--text-secondary)] hover:text-white", children: [
          uploading ? "Uploading..." : "Upload Image",
          /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", accept: "image/*", onChange: handleFileUpload })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)]", children: "Organizer / Company" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Company Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "organizer_company", value: formData.organizer_company, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Company Link" }),
          /* @__PURE__ */ jsx("input", { type: "url", name: "company_link", value: formData.company_link, onChange: handleChange, className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)]", placeholder: "https://" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-6 flex justify-end gap-4", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => window.history.back(), className: "px-6 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting || uploading, className: "px-6 py-3 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors disabled:opacity-50", children: isSubmitting ? "Saving..." : formData.id ? "Update Service" : "Create Service" })
    ] })
  ] });
}

export { ServiceForm as S };

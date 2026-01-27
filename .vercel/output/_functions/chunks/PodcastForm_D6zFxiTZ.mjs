import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_DsxxBtwu.mjs';

const generateId = () => Math.random().toString(36).substr(2, 9);
function PodcastForm({ currentUser, initialData }) {
  const [topics, setTopics] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    topic_id: initialData?.topic_slug || initialData?.topic_id || "",
    // Handle both slug (create) and potentially ID if passed differently
    host: initialData?.host || "",
    cover_image_url: initialData?.cover_image_url || initialData?.featured_image_url || ""
  });
  const [episodes, setEpisodes] = useState(
    initialData?.episodes ? initialData.episodes.map((ep) => ({ ...ep, id: generateId() })) : []
  );
  const [uploadingField, setUploadingField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchOptions = async () => {
      const { data } = await supabase.from("topics").select("id, name, slug").order("slug");
      setTopics(data || []);
      setIsLoadingOptions(false);
    };
    fetchOptions();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const addEpisode = () => {
    setEpisodes((prev) => [...prev, { id: generateId(), title: "", video_url: "" }]);
  };
  const removeEpisode = (id) => {
    setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
  };
  const updateEpisode = (id, field, value) => {
    setEpisodes((prev) => prev.map((ep) => ep.id === id ? { ...ep, [field]: value } : ep));
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only images are allowed.");
      return;
    }
    setUploadingField("cover");
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setFormData((prev) => ({ ...prev, cover_image_url: data.url }));
    } catch (error) {
      console.error(error);
      alert("Upload failed");
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
      const cleanEpisodes = episodes.map(({ title, video_url }, index) => ({
        number: index + 1,
        title,
        video_url
      }));
      const payload = {
        ...formData,
        episodes: cleanEpisodes,
        featured_image_url: formData.cover_image_url,
        // Map for polymorphic consistencies if needed
        type: "podcast"
        // Critical for API
      };
      const body = isEdit ? payload : { type: "podcast", data: payload };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      alert(isEdit ? "Podcast updated!" : "Podcast created!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoadingOptions) return /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500", children: "Loading options..." });
  const isEditMode = !!formData.id;
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 max-w-4xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2", children: "Podcast Info" }),
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
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Podcast Name / Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "title",
            value: formData.title,
            onChange: handleChange,
            required: true,
            placeholder: "e.g. Mining Insights Weekly",
            className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Host Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "host",
            value: formData.host,
            onChange: handleChange,
            placeholder: "e.g. Mahlogonolo Mashile",
            className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Cover Art" }),
        formData.cover_image_url ? /* @__PURE__ */ jsxs("div", { className: "relative w-48 h-48 rounded-lg overflow-hidden border border-[var(--border-color)] group", children: [
          /* @__PURE__ */ jsx("img", { src: formData.cover_image_url, alt: "Cover", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, cover_image_url: "" })), className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold", children: "Remove" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors bg-[var(--bg-body)] w-full md:w-1/2", children: [
          /* @__PURE__ */ jsx("input", { type: "file", id: "cover-upload", className: "hidden", accept: "image/*", onChange: handleFileUpload }),
          /* @__PURE__ */ jsx("label", { htmlFor: "cover-upload", className: "cursor-pointer text-primary-400 hover:text-primary-300 block", children: uploadingField === "cover" ? "Uploading..." : "Upload Cover Image" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "description",
            rows: 4,
            value: formData.description,
            onChange: handleChange,
            className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] focus:border-primary-500 outline-none font-mono text-sm",
            placeholder: "About this podcast..."
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[var(--border-color)] pb-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--text-main)]", children: "Episodes" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: addEpisode, className: "bg-primary-600 hover:bg-primary-500 text-white text-sm px-3 py-1 rounded-md transition-colors", children: "+ Add Episode" })
      ] }),
      episodes.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-[var(--text-secondary)] italic bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]", children: "No episodes added yet." }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: episodes.map((ep, index) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-color)] animate-fade-in-up", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-1 text-center font-mono text-[var(--text-secondary)] text-sm py-3", children: [
          "#",
          index + 1
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-5", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs text-[var(--text-secondary)] mb-1", children: "Episode Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: ep.title,
              onChange: (e) => updateEpisode(ep.id, "title", e.target.value),
              placeholder: "Episode Title",
              className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--text-main)] focus:border-primary-500 outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-5", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs text-[var(--text-secondary)] mb-1", children: "YouTube / Video URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              value: ep.video_url,
              onChange: (e) => updateEpisode(ep.id, "video_url", e.target.value),
              placeholder: "https://youtube.com/...",
              className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--text-main)] focus:border-primary-500 outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-1 flex justify-end", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeEpisode(ep.id), className: "text-red-500 hover:text-red-400 p-2", title: "Remove", children: "🗑️" }) })
      ] }, ep.id)) })
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
          className: "inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-3 px-8 text-sm font-bold text-white shadow-sm hover:bg-primary-500 focus:outline-none transition-all transform hover:scale-105 disabled:opacity-50",
          children: isSubmitting ? "Saving..." : isEditMode ? "💾 Update Podcast" : "🚀 Publish Podcast"
        }
      )
    ] })
  ] });
}

export { PodcastForm as P };

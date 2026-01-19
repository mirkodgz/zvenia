import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_HTSrsVit.mjs';

function PostForm({ currentUser, initialData }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    featured_image_url: initialData?.featured_image_url || "",
    document_url: initialData?.document_url || "",
    source: initialData?.source || "",
    topic_id: initialData?.topic_id || "",
    // Use topic_id (slug form)
    metadata: initialData?.metadata || { gallery: [] }
  });
  const [activeMediaType, setActiveMediaType] = useState("image");
  const [isUploading, setIsUploading] = useState(false);
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isPdf && !isImage && !isVideo) {
      alert("Format not supported.");
      return;
    }
    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      let finalUrl = data.url;
      if (isVideo) {
        setFormData((prev) => ({
          ...prev,
          metadata: { ...prev.metadata, video_url: finalUrl }
        }));
      } else if (isPdf) {
        setFormData((prev) => ({ ...prev, document_url: finalUrl }));
      } else {
        if (data.format === "pdf") {
          finalUrl = finalUrl.replace(/\.pdf$/i, ".jpg");
        }
        setFormData((prev) => {
          const currentGallery = prev.metadata?.gallery || [];
          if (!prev.featured_image_url) {
            return { ...prev, featured_image_url: finalUrl };
          }
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              gallery: [...currentGallery, finalUrl]
            }
          };
        });
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.id);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }
    setFormData((prev) => {
      let newSlug = prev.slug;
      if (name === "slug") {
        newSlug = value;
      } else if (name === "title" && !isSlugManuallyEdited) {
        newSlug = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      }
      return {
        ...prev,
        [name]: value,
        slug: newSlug
      };
    });
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!formData.id;
      const endpoint = isEdit ? "/api/content/update" : "/api/content/create";
      const finalPayload = {
        ...formData,
        metadata: formData.metadata
        // Explicitly include metadata
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(isEdit ? finalPayload : {
          type: "post",
          data: finalPayload
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to save post");
      }
      alert(isEdit ? "Post updated successfully!" : "Post created successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (!initialData?.id && initialData?.editId) {
      const fetchPost = async () => {
        const editId = initialData.editId;
        try {
          const { data: rawPost, error } = await supabase.from("posts").select("*").eq("id", editId).single();
          if (error || !rawPost) throw error;
          const post = rawPost;
          let topicSlug = "";
          if (post.topic_id) {
            const { data: rawTopic } = await supabase.from("topics").select("slug").eq("id", post.topic_id).single();
            const topic = rawTopic;
            if (topic) topicSlug = topic.slug;
          }
          const gallery = post.metadata?.gallery || [];
          const videoUrl = post.metadata?.video_url;
          const youtubeUrl = post.metadata?.youtube_url;
          const docUrl = post.document_url;
          setFormData({
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            featured_image_url: post.featured_image_url || "",
            document_url: docUrl || "",
            source: post.source || "",
            topic_id: topicSlug,
            metadata: post.metadata || { gallery: [] }
          });
          if (youtubeUrl) setActiveMediaType("youtube");
          else if (videoUrl) setActiveMediaType("video");
          else if (docUrl) setActiveMediaType("pdf");
          else setActiveMediaType("image");
        } catch (e) {
          console.error("Error fetching post for edit", e);
          alert("Failed to load post data.");
        }
      };
      fetchPost();
    }
  }, [initialData]);
  const [topics, setTopics] = useState([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase.from("topics").select("id, name, slug").order("slug", { ascending: true });
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
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "topic_id", className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Topic / Category" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "topic_id",
          name: "topic_id",
          required: true,
          value: formData.topic_id,
          onChange: handleChange,
          disabled: isLoadingTopics,
          className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: isLoadingTopics ? "Loading topics..." : "Select a Mining Topic..." }),
            topics.map((t) => /* @__PURE__ */ jsx("option", { value: t.slug, children: t.name }, t.id))
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-secondary)] mt-1", children: "Select the most relevant mining sector for your post." })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Title" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          name: "title",
          id: "title",
          required: true,
          value: formData.title,
          onChange: handleChange,
          className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors",
          placeholder: "How to optimize mining operations..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "slug", className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Slug (URL)" }),
      /* @__PURE__ */ jsxs("div", { className: "flex rounded-md shadow-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 rounded-l-md border border-r-0 border-[var(--border-color)] bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] sm:text-sm", children: "zvenia.com/post/" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "slug",
            id: "slug",
            required: true,
            value: formData.slug,
            onChange: handleChange,
            className: "flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-md bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-[var(--text-main)] mb-3", children: "What would you like to share? ( Optional )" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 mb-4", children: ["image", "video", "pdf", "youtube"].map((type) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            setFormData((prev) => ({
              ...prev,
              featured_image_url: "",
              document_url: "",
              metadata: { ...prev.metadata, gallery: [], video_url: "", youtube_url: "" }
            }));
            setActiveMediaType(type);
          },
          className: `flex items-center gap-2 px-4 py-2 rounded-lg border transition-all capitalize ${activeMediaType === type ? "bg-primary-500/20 border-primary-500 text-[var(--text-main)]" : "bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: `w-4 h-4 rounded-sm border ${activeMediaType === type ? "bg-primary-500 border-primary-500" : "border-gray-500"}` }),
            type === "youtube" ? "YouTube Video" : type
          ]
        },
        type
      )) }),
      /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center hover:border-primary-500/50 transition-colors bg-[var(--bg-body)] min-h-[200px] flex flex-col justify-center", children: activeMediaType === "youtube" ? /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-left text-sm text-[var(--text-secondary)] mb-1", children: "YouTube Video URL" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "url",
            placeholder: "https://www.youtube.com/watch?v=...",
            className: "w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-main)] focus:border-primary-500",
            value: formData.metadata?.youtube_url || "",
            onChange: (e) => setFormData((prev) => ({
              ...prev,
              metadata: { ...prev.metadata, youtube_url: e.target.value }
            }))
          }
        )
      ] }) : (
        // File Upload Logic (Image, Video, PDF)
        isUploading ? /* @__PURE__ */ jsxs("div", { className: "text-[var(--text-secondary)] flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2" }),
          /* @__PURE__ */ jsx("span", { children: "Uploading..." })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          formData.metadata?.video_url && activeMediaType === "video" && /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden border border-[var(--border-color)]", children: [
            /* @__PURE__ */ jsx("video", { src: formData.metadata.video_url, controls: true, className: "w-full h-auto max-h-[300px]" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setFormData((prev) => ({ ...prev, metadata: { ...prev.metadata, video_url: "" } })),
                className: "absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md z-10",
                children: "✕"
              }
            )
          ] }),
          formData.document_url && activeMediaType === "pdf" && /* @__PURE__ */ jsxs("div", { className: "relative p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] flex items-center justify-between max-w-md mx-auto w-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center truncate", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl mr-3", children: "📄" }),
              /* @__PURE__ */ jsx("a", { href: formData.document_url, target: "_blank", className: "text-sm text-primary-400 hover:underline truncate", children: formData.document_url.split("/").pop() })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, document_url: "" })), className: "text-red-500 ml-2", children: "✕" })
          ] }),
          activeMediaType === "image" && (formData.featured_image_url || formData.metadata?.gallery?.length > 0) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 w-full", children: [
            formData.featured_image_url && /* @__PURE__ */ jsxs("div", { className: "relative group aspect-square rounded-lg overflow-hidden border-2 border-primary-500/50", children: [
              /* @__PURE__ */ jsx("img", { src: formData.featured_image_url, alt: "Main", className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-white", children: "Main" }) }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => ({ ...prev, featured_image_url: "" })), className: "absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-100", children: "✕" })
            ] }),
            formData.metadata?.gallery?.map((img, idx) => /* @__PURE__ */ jsxs("div", { className: "relative group aspect-square rounded-lg overflow-hidden border border-[var(--border-color)]", children: [
              /* @__PURE__ */ jsx("img", { src: img, alt: "Gallery", className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFormData((prev) => {
                const newG = [...prev.metadata.gallery];
                newG.splice(idx, 1);
                return { ...prev, metadata: { ...prev.metadata, gallery: newG } };
              }), className: "absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity", children: "✕" })
            ] }, idx))
          ] }),
          !formData.metadata?.video_url && !formData.document_url && activeMediaType !== "image" || activeMediaType === "image" ? /* @__PURE__ */ jsxs("div", { className: `mt-4 ${activeMediaType === "image" && formData.featured_image_url ? "inline-block w-24 h-24 align-top ml-2" : ""}`, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                className: "hidden",
                id: "file-upload",
                accept: activeMediaType === "video" ? "video/mp4,video/webm,video/ogg" : activeMediaType === "pdf" ? "application/pdf" : "image/*",
                onChange: handleFileUpload,
                disabled: activeMediaType === "video" && !!formData.metadata?.video_url || activeMediaType === "pdf" && !!formData.document_url
              }
            ),
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "file-upload",
                className: `cursor-pointer flex flex-col items-center justify-center transition-colors ${activeMediaType === "image" && formData.featured_image_url ? "w-full h-full border-2 border-dashed border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface-hover)]" : "inline-block px-4 py-2 bg-[var(--bg-surface-hover)] hover:bg-[var(--bg-surface)] rounded text-sm font-bold text-[var(--text-main)]"}`,
                children: activeMediaType === "image" && formData.featured_image_url ? /* @__PURE__ */ jsx("span", { className: "text-2xl text-[var(--text-secondary)]", children: "+" }) : /* @__PURE__ */ jsx("span", { children: activeMediaType === "image" && !formData.featured_image_url ? "Select Images" : activeMediaType === "video" ? "Select Video" : "Select PDF" })
              }
            )
          ] }) : null
        ] })
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "source", className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Source / Reference (URL or Text)" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          name: "source",
          id: "source",
          value: formData.source,
          onChange: handleChange,
          className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors",
          placeholder: "https://example.com or 'Company Internal Report'"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "content", className: "block text-sm font-medium text-[var(--text-secondary)] mb-2", children: "Content" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          name: "content",
          id: "content",
          rows: 12,
          required: true,
          value: formData.content,
          onChange: handleChange,
          className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-mono text-sm",
          placeholder: "Write your article content here (Markdown supported)..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-[var(--border-color)] flex justify-end", children: [
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
          className: `inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`,
          children: isSubmitting ? "Saving..." : formData.id ? "Update Post" : "Publish Post"
        }
      )
    ] })
  ] });
}

export { PostForm as P };

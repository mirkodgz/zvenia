import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import './supabase_HTSrsVit.mjs';

function PostFormAdmin({ currentUser, initialData, topics }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    featured_image_url: initialData?.featured_image_url || "",
    document_url: initialData?.document_url || "",
    source: initialData?.source || "",
    topic_id: initialData?.topic_id || "",
    metadata: initialData?.metadata || { gallery: [] }
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.id);
  useEffect(() => {
    if (!isSlugManuallyEdited && formData.title) {
      const generatedSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, isSlugManuallyEdited]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }
  };
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "pdf" && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
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
      if (type === "image" && data.format === "pdf") {
        finalUrl = finalUrl.replace(/\.pdf$/i, ".jpg");
      }
      if (type === "pdf") {
        setFormData((prev) => ({ ...prev, document_url: finalUrl }));
      } else {
        setFormData((prev) => ({ ...prev, featured_image_url: finalUrl }));
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!formData.id;
      const endpoint = isEdit ? "/api/content/update" : "/api/content/create";
      const finalPayload = {
        ...formData,
        metadata: formData.metadata
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
      window.location.href = "/admin/posts";
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-6 shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Title *" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          id: "title",
          name: "title",
          value: formData.title,
          onChange: handleChange,
          required: true,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500",
          placeholder: "Enter post title"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "slug", className: "block text-sm font-medium text-gray-700 mb-2", children: "Slug *" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          id: "slug",
          name: "slug",
          value: formData.slug,
          onChange: handleChange,
          required: true,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500",
          placeholder: "post-url-slug"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "URL-friendly version of the title" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "topic_id", className: "block text-sm font-medium text-gray-700 mb-2", children: "Topic *" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "topic_id",
          name: "topic_id",
          value: formData.topic_id,
          onChange: handleChange,
          required: true,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select a topic" }),
            topics.map((topic) => /* @__PURE__ */ jsx("option", { value: topic.slug, children: topic.name }, topic.id))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "excerpt", className: "block text-sm font-medium text-gray-700 mb-2", children: "Excerpt" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "excerpt",
          name: "excerpt",
          value: formData.excerpt,
          onChange: handleChange,
          rows: 3,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500",
          placeholder: "Brief description of the post"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "content", className: "block text-sm font-medium text-gray-700 mb-2", children: "Content *" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "content",
          name: "content",
          value: formData.content,
          onChange: handleChange,
          required: true,
          rows: 10,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500",
          placeholder: "Post content"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Featured Image" }),
      formData.featured_image_url && /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: formData.featured_image_url,
          alt: "Featured",
          className: "w-32 h-32 object-cover rounded-md border border-gray-300"
        }
      ) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          accept: "image/*",
          onChange: (e) => handleFileUpload(e, "image"),
          disabled: isUploading,
          className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        }
      ),
      isUploading && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Uploading..." })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "PDF Document (Optional)" }),
      formData.document_url && /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: formData.document_url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-primary-600 hover:text-primary-700 text-sm",
          children: "View PDF"
        }
      ) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          accept: "application/pdf",
          onChange: (e) => handleFileUpload(e, "pdf"),
          disabled: isUploading,
          className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "source", className: "block text-sm font-medium text-gray-700 mb-2", children: "Source" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          id: "source",
          name: "source",
          value: formData.source,
          onChange: handleChange,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500",
          placeholder: "Source URL or name"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => window.location.href = "/admin/posts",
          className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isSubmitting,
          className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
          children: isSubmitting ? "Saving..." : formData.id ? "Update Post" : "Create Post"
        }
      )
    ] })
  ] }) });
}

export { PostFormAdmin as P };

import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, k as renderComponent, n as renderScript, r as renderTemplate } from './astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from './supabase_DZBRYQhj.mjs';
import { createClient } from '@supabase/supabase-js';

function PostOptions({ postId, authorId, currentUserId, currentUserRole, slug }) {
  console.log(`[PostOptions Debug] Post: ${postId}, User: ${currentUserId}, Role: ${currentUserRole}`);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const canEdit = currentUserId === authorId || currentUserRole === "Administrator";
  if (!canEdit) return null;
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/content/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      });
      if (response.ok) {
        alert("Post deleted.");
        if (window.location.pathname.includes("/post/")) {
          window.location.href = "/";
        } else {
          window.location.reload();
        }
      } else {
        alert("Failed to delete post.");
      }
    } catch (e) {
      console.error("Delete error", e);
      alert("Error deleting post.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: menuRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: (e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        },
        className: "text-(--text-secondary) hover:text-(--text-main) p-1 rounded-full hover:bg-(--bg-surface-hover) transition-colors",
        title: "Options",
        children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" }) })
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-(--bg-card) rounded-md shadow-lg py-1 border border-(--border-color) z-50 overflow-hidden animate-fade-in", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setIsOpen(false);
            const returnTo = encodeURIComponent(window.location.pathname);
            window.location.href = `/dashboard/posts/edit/${postId}?returnTo=${returnTo}`;
          },
          className: "w-full text-left px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-(--text-main) flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
            "Edit Post"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleDelete();
          },
          className: "w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
            "Delete Post"
          ]
        }
      )
    ] })
  ] });
}

function LikeButton({ contentId, contentType, initialCount, currentUserId, sessionAccessToken }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const processingRef = useRef(false);
  useEffect(() => {
    if (!currentUserId) return;
    checkIfLiked();
  }, [contentId, currentUserId]);
  const checkIfLiked = async () => {
    try {
      const { data, error } = await supabase.from("social_likes").select("id").eq("user_id", currentUserId).eq("content_type", contentType).eq("content_id", contentId).maybeSingle();
      if (data) {
        setLiked(true);
      }
    } catch (err) {
      console.error("Error checking like status:", err);
    }
  };
  const handleToggleLike = async () => {
    let activeUser = null;
    let effectiveClient = supabase;
    const { data: { user } } = await supabase.auth.getUser();
    activeUser = user;
    if (!activeUser && sessionAccessToken) {
      console.log("⚠️ Client auth lost. Using isolated client with explicit token...");
      const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
      effectiveClient = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${sessionAccessToken}`
          }
        }
      });
      const { data: { user: recoveredUser } } = await effectiveClient.auth.getUser();
      activeUser = recoveredUser;
    }
    if (!activeUser) {
      console.error("Debug: No user found even with recovery.");
      alert("Please sign in to like content.");
      return;
    }
    const actorId = activeUser.id;
    if (processingRef.current) return;
    processingRef.current = true;
    const previousLiked = liked;
    const previousCount = count;
    setLiked(!previousLiked);
    setCount(previousLiked ? previousCount - 1 : previousCount + 1);
    try {
      if (previousLiked) {
        const { error } = await effectiveClient.from("social_likes").delete().match({
          user_id: actorId,
          content_type: contentType,
          content_id: contentId
        });
        if (error) throw error;
      } else {
        const { error } = await effectiveClient.from("social_likes").insert({
          user_id: actorId,
          content_type: contentType,
          content_id: contentId
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setLiked(previousLiked);
      setCount(previousCount);
      alert(`Error: ${err.message || "Unknown error"}`);
    } finally {
      processingRef.current = false;
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        handleToggleLike();
      },
      className: `flex items-center gap-1.5 transition-colors group text-xs font-medium ${liked ? "text-green-500" : "hover:text-green-500"}`,
      children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            className: `h-4 w-4 ${liked ? "fill-current" : "group-hover:fill-current"}`,
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" })
          }
        ),
        "Like ",
        count > 0 && `(${count})`
      ]
    }
  );
}

function ShareOptions({ slug, title, postId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const getUrl = () => {
    const path = `/post/${slug || postId}`;
    return `${window.location.origin}${path}`;
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleCopyLink = () => {
    const url = getUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2e3);
    });
  };
  const handleShare = (platform) => {
    if (platform === "instagram") {
      const url2 = getUrl();
      navigator.clipboard.writeText(url2).then(() => {
        alert("Link copied! You can now paste it on Instagram.");
        setIsOpen(false);
      });
      return;
    }
    const url = encodeURIComponent(getUrl());
    const encodedTitle = encodeURIComponent(title);
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setIsOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: menuRef, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(!isOpen);
        },
        className: `flex items-center gap-1.5 hover:text-green-400 transition-colors ${isOpen ? "text-green-400" : ""} text-xs font-medium`,
        children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }) }),
          "Share"
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 bottom-full mb-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg py-1 border border-[var(--border-color)] z-50 overflow-hidden animate-fade-in", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleCopyLink();
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-green-400 w-full text-left flex items-center gap-2",
          children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-green-500 font-bold", children: "Copied!" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
            "Copy Link"
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border-color)] my-1" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleShare("facebook");
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-green-400 w-full text-left flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" }) }),
            "Facebook"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleShare("x");
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-green-400 w-full text-left flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) }),
            "Twitter"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleShare("linkedin");
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-green-400 w-full text-left flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.1-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.311c0-4.662 5.56-5.142 5.56 2.431v5.88h5v-8.85c0-6.959-7.406-6.843-10.592-3.32v-2.14z" }) }),
            "LinkedIn"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleShare("instagram");
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-green-400 w-full text-left flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" }) }),
            "Instagram"
          ]
        }
      )
    ] })
  ] });
}

function CommentSection({ contentId, contentType, currentUserId, sessionAccessToken }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    fetchComments();
  }, [contentId]);
  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("social_comments").select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles (
                        username,
                        full_name,
                        avatar_url
                    )
                `).eq("content_type", contentType).eq("content_id", contentId).order("created_at", { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;
    setSubmitting(true);
    try {
      let effectiveClient = supabase;
      if (sessionAccessToken) {
        const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
        effectiveClient = createClient(supabaseUrl, supabaseKey, {
          global: {
            headers: {
              Authorization: `Bearer ${sessionAccessToken}`
            }
          }
        });
      }
      const { data, error } = await effectiveClient.from("social_comments").insert({
        content: newComment.trim(),
        content_type: contentType,
        content_id: contentId,
        user_id: currentUserId
      }).select().single();
      if (error) throw error;
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert(`Error posting comment: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(void 0, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-xs text-gray-500", children: "Loading comments..." });
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-(--border-color) bg-(--bg-surface-hover)/50", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 space-y-4 max-h-96 overflow-y-auto", children: comments.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 text-center italic", children: "No comments yet. Be the first!" }) : comments.map((c) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden", children: c.profiles?.avatar_url ? /* @__PURE__ */ jsx("img", { src: c.profiles.avatar_url, alt: c.profiles.username, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold", children: c.profiles?.username?.[0]?.toUpperCase() || "?" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-(--bg-card) p-3 rounded-lg rounded-tl-none border border-(--border-color) text-sm shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-(--text-main) text-xs", children: c.profiles?.full_name || "Unknown" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400", children: formatDate(c.created_at) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-(--text-secondary) whitespace-pre-wrap", children: c.content })
      ] }) })
    ] }, c.id)) }),
    currentUserId ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-3 border-t border-(--border-color) flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: newComment,
          onChange: (e) => setNewComment(e.target.value),
          placeholder: "Write a comment...",
          className: "flex-1 bg-(--bg-main) border border-(--border-color) rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors",
          disabled: submitting
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: submitting || !newComment.trim(),
          className: "bg-green-500 hover:bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" }) })
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "p-3 text-center border-t border-(--border-color)", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
      "Please ",
      /* @__PURE__ */ jsx("a", { href: "/login", className: "text-green-500 hover:underline", children: "sign in" }),
      " to comment."
    ] }) })
  ] });
}

function SocialFooter({
  postId,
  postSlug,
  postTitle,
  likesCount,
  commentsCount,
  currentUserId,
  sessionAccessToken
}) {
  const [showComments, setShowComments] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-(--bg-surface-hover) border-t border-(--border-color) flex justify-between items-center text-(--text-secondary)", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-xs font-medium", children: [
        /* @__PURE__ */ jsx(
          LikeButton,
          {
            contentId: postId,
            contentType: "post",
            initialCount: likesCount,
            currentUserId,
            sessionAccessToken
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowComments(!showComments),
            className: `flex items-center gap-1.5 transition-colors ${showComments ? "text-blue-400" : "hover:text-blue-400"}`,
            children: [
              /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }),
              "Comment ",
              localCommentsCount > 0 && `(${localCommentsCount})`
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        ShareOptions,
        {
          slug: postSlug,
          title: postTitle,
          postId
        }
      ) })
    ] }),
    showComments && /* @__PURE__ */ jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsx(
      CommentSection,
      {
        contentId: postId,
        contentType: "post",
        currentUserId,
        sessionAccessToken
      }
    ) })
  ] });
}

const $$Astro = createAstro();
const $$PostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostCard;
  const { post, currentUser, isDetail = false } = Astro2.props;
  console.log(
    `[PostCard Debug] ID: ${post.id}, PDF: "${post.document_url}", IMG: "${post.featured_image_url}"`
  );
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const profileUrl = post.author?.profile_slug ? `/profile/${post.author.profile_slug}` : `/in/${post.author_id}`;
  const getCleanContent = (item) => {
    const raw = item.content || item.excerpt || item.description || "";
    if (!raw) return "";
    return raw.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/div>/gi, "\n").replace(/<li>/gi, "\u2022 ").replace(/<\/li>/gi, "\n").replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
  };
  return renderTemplate`${maybeRenderHead()}<article class="bg-white overflow-hidden transition-colors animate-fade-in w-full mb-16 rounded-sm" style="border: 0.1px none #22232633; box-shadow: 1px 2px 2px 2px #22232633;"> <!-- 1. Header: Author, Date, Options --> <div class="p-4 flex gap-3 items-start justify-between border-b border-(--border-color)"> <div class="flex gap-3 items-center flex-1"> <!-- Avatar --> <a${addAttribute(profileUrl, "href")} class="block shrink-0"> <div class="w-12 h-12 rounded-full bg-linear-to-br from-gray-300 to-gray-400 border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 overflow-hidden hover:opacity-90 transition-opacity shadow-sm"> ${post.author?.avatar_url ? renderTemplate`<img${addAttribute(post.author.avatar_url, "src")} class="w-full h-full object-cover"${addAttribute(post.author?.full_name || "Author", "alt")}>` : renderTemplate`<span class="text-base"> ${post.author?.full_name?.[0] || post.author_name?.[0] || "U"} </span>`} </div> </a> <!-- Meta --> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 flex-wrap"> <a${addAttribute(profileUrl, "href")} class="block group min-w-0"> <h3 class="text-base font-bold text-dark group-hover:text-primary-500 cursor-pointer transition-colors truncate"> ${post.author?.full_name || post.author_name || "Unknown Author"} </h3> </a> </div> <p class="text-xs text-[#0009] mt-0.5" style="font-size: 12px;"> ${formatDate(post.published_at || post.created_at)} </p> </div> </div> <!-- Menu (Edit/Delete) --> ${renderComponent($$result, "PostOptions", PostOptions, { "client:visible": true, "postId": post.id, "authorId": post.author_id, "currentUserId": currentUser?.id, "currentUserRole": currentUser?.role, "slug": post.slug, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/PostOptions", "client:component-export": "default" })} </div> <!-- 2. Body: Content --> <div class="px-4 pb-2 pt-4">  ${post.topic && renderTemplate`<a${addAttribute(`/mining/${post.topic.slug}`, "href")} class="inline-block mb-3 transition-colors group"> <span class="zv--post-termslink text-dark group-hover:text-primary-500 transition-colors inline-flex items-center gap-1.5"> <span class="material-icons" style="font-size: 12px;">
arrow_back
</span> ${post.topic.name} </span> </a>`} ${isDetail ? renderTemplate`<h1 class="mb-3 text-dark" style="font-size: 17px !important; line-height: 1.3em !important; font-weight: 700 !important;"> ${post.title} </h1>` : renderTemplate`<a${addAttribute(`/post/${post.slug || post.id}`, "href")} class="block group"> <h4 class="text-base font-bold text-dark mb-1 group-hover:underline cursor-pointer transition-colors"> ${post.title} </h4> </a>`} <p${addAttribute(`post-content text-dark leading-relaxed mb-3 transition-all duration-300 whitespace-pre-wrap ${!isDetail ? "line-clamp-3" : ""}`, "class")} style="font-size: 15px; font-weight: 400;"${addAttribute(isDetail, "data-is-detail")}> ${getCleanContent(post)} </p> ${!isDetail ? renderTemplate`<button class="read-more-btn mb-4 block text-right cursor-pointer" style="font-size: 15px; font-weight: 400; color: #0a66c2; text-align: right; width: 100%;">
...read more
</button>` : renderTemplate`<button class="read-more-btn-detail mb-4 block text-right opacity-0 pointer-events-none transition-opacity cursor-pointer" style="display: none; font-size: 15px; font-weight: 400; color: #0a66c2; text-align: right; width: 100%;">
...read more
</button>`} ${post.source && renderTemplate`<div class="mb-3" style="font-size: 15px;"> ${post.source.startsWith("http") ? renderTemplate`<a${addAttribute(post.source, "href")} target="_blank" rel="noopener noreferrer" class="text-dark hover:underline break-all truncate block"> ${post.source} </a>` : renderTemplate`<span class="text-dark italic">
Source: ${post.source} </span>`} </div>`} </div> <!-- 3. Media: PDF or Gallery --> <!-- 3. Media: YouTube, Video, PDF, or Gallery --> ${(() => {
    const youtubeUrl = post.metadata?.youtube_url;
    const videoUrl = post.metadata?.video_url;
    if (youtubeUrl) {
      let videoId = "";
      try {
        if (youtubeUrl.includes("youtube.com/watch")) {
          videoId = new URL(youtubeUrl).searchParams.get("v") || "";
        } else if (youtubeUrl.includes("youtu.be/")) {
          videoId = youtubeUrl.split("youtu.be/")[1].split("?")[0];
        }
      } catch (e) {
      }
      if (videoId) {
        return renderTemplate`<div class="w-full aspect-video bg-gray-100 overflow-hidden"> <iframe width="100%" height="100%"${addAttribute(`https://www.youtube.com/embed/${videoId}`, "src")} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div>`;
      }
    }
    if (videoUrl) {
      return renderTemplate`<div class="w-full bg-gray-100 overflow-hidden"> <video controls class="w-full max-h-[500px]"> <source${addAttribute(videoUrl, "src")} type="video/mp4">
Your browser does not support the video tag.
</video> </div>`;
    }
    if (post.document_url) {
      return renderTemplate`<div class="px-4 pb-4"> <div style="overflow: hidden;"> ${renderComponent($$result, "PdfViewer", null, { "client:only": "react", "url": `/api/pdf-proxy?url=${encodeURIComponent(post.document_url)}`, "client:component-hydration": "only", "client:component-path": "D:/zveniaproject/src/components/social/PdfViewer", "client:component-export": "PdfViewer" })} </div> </div>`;
    }
    const gallery = post.metadata?.gallery || [];
    const allImages = [post.featured_image_url, ...gallery].filter(
      Boolean
    );
    if (allImages.length === 0) return null;
    if (allImages.length === 1) {
      return renderTemplate`<div class="w-full h-80 bg-gray-100 overflow-hidden"> <img${addAttribute(allImages[0], "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover" loading="lazy"> </div>`;
    }
    return renderTemplate`<div class="relative w-full h-[400px] bg-gray-100 overflow-hidden group carousel-container">  <div class="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth carousel-track"> ${allImages.map((img, idx) => renderTemplate`<div class="w-full h-full shrink-0 snap-center relative"> <img${addAttribute(img, "src")}${addAttribute(`${post.title} - ${idx + 1}`, "alt")} class="w-full h-full object-contain bg-gray-100" loading="lazy"> <div class="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"> ${idx + 1} / ${allImages.length} </div> </div>`)} </div>  <button class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 nav-prev"> <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg> </button> <button class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 nav-next"> <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </button> </div>`;
  })()} <!-- 4. Footer: Actions --> ${renderComponent($$result, "SocialFooter", SocialFooter, { "client:visible": true, "postId": post.id, "postSlug": post.slug, "postTitle": post.title, "likesCount": post.likes_count || 0, "commentsCount": post.comments_count || 0, "currentUserId": currentUser?.id, "sessionAccessToken": Astro2.locals.session?.access_token, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/SocialFooter", "client:component-export": "default" })} </article> ${renderScript($$result, "D:/zveniaproject/src/components/social/PostCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/components/social/PostCard.astro", void 0);

export { $$PostCard as $ };

-- Fix Zachariah Chitanda's profile picture
-- Source: User provided XML export (Cloudinary ID 26387 resolved)

UPDATE profiles
SET avatar_url = 'https://res.cloudinary.com/dun3slcfg/images/v1767637743/cloud-files/WhatsApp-Image-2025-08-06-at-9.22.36-AM/WhatsApp-Image-2025-08-06-at-9.22.36-AM.jpeg?_i=AA'
WHERE email = 'zachariachitanda@gmail.com';

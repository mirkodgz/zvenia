
# Admin Dashboard Plan

## Component: `src/components/admin/UserManagement.tsx`
- **Purpose:** React component to manage users.
- **Features:**
  - List users from `profiles` table.
  - Search by email.
  - Edit Role (Dropdown).
  - Edit Country (Input/Dropdown, conditional for CountryManager).
  - Validation: Only Administrator can perform these actions.

## Page: `src/pages/admin.astro`
- **Purpose:** Route to host the dashboard.
- **Access Control:** Check `user.role === 'Administrator'` in frontmatter. Redirect to `/` if unauthorized.
- **Layout:** Standard site layout, or specific admin layout (simplified).

## Flow
1. Admin logs in.
2. Navigates to `/admin`.
3. Sees table of users.
4. Updates a user role to 'Expert'.
5. User refreshes and gains 'Expert' capabilities.

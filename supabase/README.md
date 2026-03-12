# Supabase setup for STC

## 1. Run migrations

In the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new), run in order:

1. `migrations/20260304000000_initial_schema.sql`
2. `migrations/20260305000000_add_admin_type.sql` (if using admin)
3. `migrations/20260306000000_study_destinations.sql` (adds `study_destinations` table for admin-managed study countries; home and etudes pages use this).
4. `migrations/20260307000000_study_destinations_drop_flag.sql` (removes `flag` column; study image is used instead).

## 2. Create Storage bucket for documents

1. Go to **Storage** in the Supabase Dashboard.
2. Click **New bucket**.
3. Name: `documents`.
4. Set to **Public** if you want direct file URLs (recommended for application documents). Otherwise keep private and use signed URLs in your app.
5. Create the bucket.

## 3. Admin user (optional)

To access the admin dashboard at `/admin`, set a user as admin:

1. Run the migration `20260305000000_add_admin_type.sql` (adds `admin` to allowed `user_type`).
2. In Supabase SQL Editor, set a profile to admin (replace with the real user id from Auth):

```sql
UPDATE public.profiles SET user_type = 'admin' WHERE email = 'your-admin@example.com';
```

Or for a new user, after they sign up, run:

```sql
UPDATE public.profiles SET user_type = 'admin' WHERE id = 'their-auth-user-uuid';
```

## 4. Auth redirect URLs

In **Authentication → URL Configuration**, add:

- **Site URL:** `http://localhost:3000` (or your production URL)
- **Redirect URLs:** `http://localhost:3000/auth/callback` (and your production callback URL)

# Supabase setup for STC

## 1. Run migrations

In the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new), run the contents of `migrations/20260304000000_initial_schema.sql`.

## 2. Create Storage bucket for documents

1. Go to **Storage** in the Supabase Dashboard.
2. Click **New bucket**.
3. Name: `documents`.
4. Set to **Public** if you want direct file URLs (recommended for application documents). Otherwise keep private and use signed URLs in your app.
5. Create the bucket.

## 3. Auth redirect URLs

In **Authentication → URL Configuration**, add:

- **Site URL:** `http://localhost:3000` (or your production URL)
- **Redirect URLs:** `http://localhost:3000/auth/callback` (and your production callback URL)

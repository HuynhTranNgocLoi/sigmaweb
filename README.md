# Supabase + Next.js + GitHub Actions + Vercel

Website mẫu CRUD Todo sử dụng:

- Next.js + TypeScript
- Supabase PostgreSQL
- GitHub Actions cho CI/CD
- Vercel để deploy

## 1. Chạy local

```bash
npm install
copy .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

Điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 2. Tạo database Supabase

Vào Supabase Dashboard → SQL Editor → chạy toàn bộ:

```text
supabase/schema.sql
```

Schema tạo bảng `tasks` và RLS policies cho CRUD demo.

> Đây là demo public. Nếu triển khai production có user accounts, nên đổi RLS để mỗi user chỉ đọc/sửa dữ liệu của chính họ.

## 3. Tạo project trên Vercel

Import repository GitHub vào Vercel một lần để tạo project.

Sau đó lấy:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`

Có thể lấy project/org ID trong `.vercel/project.json` sau khi chạy:

```bash
vercel link
```

## 4. GitHub Secrets

Repository → Settings → Secrets and variables → Actions → New repository secret.

Thêm:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 5. CI/CD

Workflow:

```text
git push origin main
        ↓
GitHub Actions
        ↓
npm ci
        ↓
npm run lint
        ↓
npm run build
        ↓
Vercel CLI
        ↓
Production deployment
        ↓
Vercel URL
```

File workflow:

```text
.github/workflows/deploy.yml
```

Mỗi lần push vào `main`, GitHub Actions sẽ tự động kiểm tra và deploy bản code mới lên Vercel.

## Lưu ý

Không commit `.env.local` hoặc secret/token vào GitHub.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` được thiết kế để có thể xuất hiện ở client khi RLS được cấu hình đúng; tuyệt đối không đưa `service_role` key vào frontend hoặc GitHub Actions build nếu không cần thiết.

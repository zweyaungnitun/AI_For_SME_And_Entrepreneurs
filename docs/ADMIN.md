# Admin Access Note

The `/admin` routes are for **platform administrators only** (e.g., bank staff managing multiple SME clients).

**Regular businesses** use:
- `/dashboard` - See only their own data
- `/enter` - Switch between demo workspaces

**Platform admins** use:
- `/admin` - View all businesses
- `/admin/import` - Import business data from Excel
- `/admin/gdrive` - Connect Google Drive for bulk imports

## Tenant Isolation

Each business workspace is isolated:
- Businesses can only see their own cash, receivables, payables, and inventory
- The session is locked to a single `shopId`
- No cross-tenant data access through the API

## Access Control

In production, add authentication middleware to protect `/admin/*` routes:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // Check if user has admin role
    // Redirect to login if not authorized
  }
}
```

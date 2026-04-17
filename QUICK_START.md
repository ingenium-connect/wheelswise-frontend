# Quick Start Guide - New Auth & State System

## 🚀 What Changed?

Your app now has:
1. **Secure httpOnly tokens** - Tokens can't be stolen via XSS
2. **Centralized auth** - Use `useAuth()` hook everywhere
3. **API proxy** - All authenticated requests go through `/api/proxy/*`
4. **Consolidated state** - One store for entire insurance flow
5. **Auth guards** - Dashboard automatically protected
6. **Error boundaries** - Graceful error handling

## 🔑 Key Changes for Developers

### 1. Making Authenticated API Calls

**OLD WAY (Don't use):**
```tsx
import { axiosAuthClient } from "@/utilities/axios-client";

// ❌ This won't work anymore (token is httpOnly)
const response = await axiosAuthClient.get("/users/profile");
```

**NEW WAY (Use this):**
```tsx
import { proxyGet, proxyPost } from "@/utilities/api-proxy";

// ✅ Use proxy helpers
const profile = await proxyGet("/users/profile");
const result = await proxyPost("/vehicles", { make: "Toyota" });
```

### 2. Checking Auth Status

**OLD WAY:**
```tsx
// ❌ Don't read cookies directly
const token = parseCookies()[ACCESS_TOKEN];
const isAuth = Boolean(token);
```

**NEW WAY:**
```tsx
import { useAuth } from "@/hooks/useAuth";

// ✅ Use auth context
const { isAuthenticated, user, isLoading } = useAuth();
```

### 3. Accessing State

**OLD WAY:**
```tsx
import { useInsuranceStore } from "@/stores/insuranceStore";
import { useVehicleStore } from "@/stores/vehicleStore";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";

// ❌ Three separate stores
const { cover } = useInsuranceStore();
const { vehicleValue } = useVehicleStore();
const { personalDetails } = usePersonalDetailsStore();
```

**NEW WAY (Recommended):**
```tsx
import { useInsuranceFlowStore } from "@/stores/insuranceFlowStore";

// ✅ One consolidated store
const { insurance, vehicle, personal } = useInsuranceFlowStore();
const cover = insurance.cover;
const vehicleValue = vehicle.vehicleValue;
const user = personal.user;
```

**OR (Backwards compatible - works but not ideal):**
```tsx
// ✅ Old imports still work due to compatibility layer
import { useInsuranceStore } from "@/stores/insuranceFlowStore";
import { useVehicleStore } from "@/stores/insuranceFlowStore";
import { usePersonalDetailsStore } from "@/stores/insuranceFlowStore";

// These work exactly as before
const { cover } = useInsuranceStore();
const { vehicleValue } = useVehicleStore();
const { personalDetails } = usePersonalDetailsStore();
```

### 4. Protecting Routes

**Dashboard routes are automatically protected** by the layout:

```tsx
// app/(auth)/dashboard/my-page/page.tsx
// ✅ No need to add auth checks - layout handles it
export default function MyPage() {
  return <div>Protected content</div>;
}
```

**For custom protection:**
```tsx
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function CustomPage() {
  return (
    <RequireAuth>
      <YourContent />
    </RequireAuth>
  );
}
```

### 5. Clearing State

**On logout (automatic):**
```tsx
import { useAuth } from "@/hooks/useAuth";

const { logout } = useAuth();
await logout(); // Clears everything automatically
```

**Manual reset of flow:**
```tsx
import { useInsuranceFlowStore } from "@/stores/insuranceFlowStore";

const { resetFlow } = useInsuranceFlowStore();
resetFlow(); // Clear insurance flow state
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot read token"
**Solution:** Use the proxy helpers from `api-proxy.ts` instead of trying to read cookies directly.

### Issue: "Store not updating"
**Solution:** Make sure you're using the new `useInsuranceFlowStore` or the compatibility exports.

### Issue: "Auth check failing"
**Solution:** Ensure cookies are being set by the API routes (check Network tab in DevTools).

### Issue: "Getting redirected unexpectedly"
**Solution:** Check if you have a valid auth token. The `RequireAuth` component will redirect if not authenticated.

## 📚 Important Files

- `utilities/api-proxy.ts` - Use these helpers for all authenticated API calls
- `hooks/useAuth.ts` - Use this hook for auth state
- `stores/insuranceFlowStore.ts` - Use this store for flow state
- `contexts/AuthContext.tsx` - Auth context (usually don't need to import directly)

## ✅ Checklist for New Features

When building new features, remember:

- [ ] Use `proxyGet/proxyPost` for authenticated API calls
- [ ] Use `useAuth()` hook for auth state
- [ ] Use `useInsuranceFlowStore()` for flow state
- [ ] Wrap sensitive pages in `<RequireAuth>` if needed
- [ ] Add error boundaries for critical sections
- [ ] Clear flow state after successful operations

## 🆘 Need Help?

1. Check `IMPLEMENTATION_SUMMARY.md` for detailed documentation
2. Look at existing components for examples
3. Check the browser console for helpful error messages
4. All error boundaries show user-friendly messages

## 🎯 Quick Reference

```tsx
// Auth
import { useAuth } from "@/hooks/useAuth";
const { user, isAuthenticated, isLoading, logout } = useAuth();

// API Calls
import { proxyGet, proxyPost, proxyPut, proxyPatch, proxyDelete } from "@/utilities/api-proxy";
const data = await proxyGet("/endpoint");

// State
import { useInsuranceFlowStore } from "@/stores/insuranceFlowStore";
const { insurance, vehicle, personal, resetFlow } = useInsuranceFlowStore();

// Guards
import { RequireAuth } from "@/components/auth/RequireAuth";
<RequireAuth><ProtectedContent /></RequireAuth>

// Error Boundaries
import { ErrorBoundary } from "@/components/ErrorBoundary";
<ErrorBoundary><YourComponent /></ErrorBoundary>
```

---

**Ready to go! 🚀**

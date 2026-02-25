# Setting an HTTP cookie for auth (Next.js examples)

This document shows two short examples for setting an HTTP cookie for an auth token so `cookies()` on server components can read it.

## 1) Example: Next.js App Router `route.ts` handler (server)

```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  // Set cookie for 7 days, HttpOnly, Secure (use Secure:true in production HTTPS)
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "ACCESS_TOKEN", // make sure this matches your ACCESS_TOKEN constant
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
```

## 2) Example: server-side response with `Set-Cookie` header (Node/Express)

```js
// express handler
app.post("/auth/login", (req, res) => {
  const token = createTokenForUser(req.user);
  res.cookie("ACCESS_TOKEN", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ ok: true });
});
```

## Notes and gotchas

- If you need server components to read the token using `cookies()` it must be set as an HTTP cookie (not localStorage).
- For local development on `http://localhost` set `secure: false` — secure cookies are ignored on insecure origins.
- `SameSite` can block cookies in cross-site contexts; `lax` is generally safe for top-level navigations.
- Ensure `name` matches your `ACCESS_TOKEN` constant exactly.
- Use `httpOnly: true` to prevent client JS from reading the token.

If you want, I can add a short `route.ts` handler in `app/api/auth/set-cookie/route.ts` as an example in your repo.

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
function createSupabase(env = process.env, request = fetch) {
  const url = env.SUPABASE_URL?.replace(/\/$/, "");
  const key = env.SUPABASE_ANON_KEY;
  const configured = Boolean(url && key);
  async function call(
    path,
    { token, method = "GET", body, service = false, extraHeaders = {} } = {},
  ) {
    if (!configured || (service && !env.SUPABASE_SERVICE_ROLE_KEY))
      throw new ApiError(503, "Database is not configured.");
    const headers = {
      apikey: service ? env.SUPABASE_SERVICE_ROLE_KEY : key,
      "Content-Type": "application/json",
      ...extraHeaders,
    };
    if (token) headers.Authorization = "Bearer " + token;
    // Service-role calls are restricted to server-validated quote and onboarding data.
    if (service && env.SUPABASE_SERVICE_ROLE_KEY.startsWith("ey"))
      headers.Authorization = "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY;
    let response;
    try {
      response = await request(url + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new ApiError(503, "Database connection unavailable.");
    }
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    if (!response.ok) {
      if (["P0001", "42501", "23514", "23505", "22P02"].includes(data?.code))
        throw new ApiError(
          data.code === "42501" ? 403 : 409,
          data.code === "P0001"
            ? data.message
            : "The requested change is not allowed.",
        );
      throw new ApiError(
        response.status === 401 ? 401 : 503,
        response.status === 401
          ? "Please sign in again."
          : "Database request unavailable.",
      );
    }
    return data;
  }
  return {
    configured,
    url,
    key,
    call,
    rows: (table, query, token) =>
      call("/rest/v1/" + table + "?" + query, { token }),
    rpc: (name, body, token, service = false) =>
      call("/rest/v1/rpc/" + name, { method: "POST", body, token, service }),
    async authenticate(token) {
      if (!token || token.length > 10000)
        throw new ApiError(401, "Please sign in.");
      const user = await call("/auth/v1/user", { token });
      if (!user?.id) throw new ApiError(401, "Please sign in again.");
      const profilePath =
        "/rest/v1/profiles?id=eq." + encodeURIComponent(user.id) + "&select=*";
      let profiles = await call(
        profilePath,
        { token },
      );
      let profile = profiles?.[0];
      if (!profile && (user.email_confirmed_at || user.phone_confirmed_at)) {
        const metadataName = user.user_metadata?.name;
        const name =
          typeof metadataName === "string" ? metadataName.trim().slice(0, 100) : "";
        await call("/rest/v1/profiles?on_conflict=id", {
          method: "POST",
          body: {
            id: user.id,
            name,
            phone: user.phone || null,
            role: "customer",
            active: true,
          },
          service: true,
          extraHeaders: {
            Prefer: "resolution=ignore-duplicates,return=minimal",
          },
        });
        profiles = await call(profilePath, { service: true });
        profile = profiles?.[0];
      }
      if (!profile?.active)
        throw new ApiError(403, "Account access is disabled.");
      return {
        ...profile,
        email: user.email || null,
        email_verified: Boolean(user.email_confirmed_at),
        phone_verified: Boolean(user.phone_confirmed_at),
      };
    },
  };
}
module.exports = { createSupabase, ApiError };

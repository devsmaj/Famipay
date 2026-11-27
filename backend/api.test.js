const { test } = require("node:test"),
  assert = require("node:assert/strict");
const { createApp } = require("./platform/app");
const { ApiError, createSupabase } = require("./platform/supabase");
const { roadRoute } = require("./platform/routing");
const { providers } = require("./platform/payments");
const id = "00000000-0000-4000-8000-000000000001";
test("unapproved cart items remain visible and removable without inventing a price", async () => {
  const calls = [];
  const db = {
    configured: true,
    authenticate: async () => ({ id, role: "customer" }),
    rows: async () => [{ item_id: id, quantity: 2, menu_items: null }],
    rpc: async (name, args) => {
      calls.push({ name, args });
    },
  };
  const server = createApp({ db }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    const cart = await (
      await fetch(base + "/api/cart", {
        headers: { Authorization: "Bearer TEST" },
      })
    ).json();
    assert.equal(cart[0].id, id);
    assert.equal(cart[0].price, null);
    assert.equal(cart[0].available, false);
    assert.equal(
      (
        await fetch(base + "/api/cart/" + id, {
          method: "DELETE",
          headers: { Authorization: "Bearer TEST" },
        })
      ).status,
      200,
    );
    assert.equal(calls[0].args.p_quantity, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("protected API rejects forged identity, amounts and role escalation", async () => {
  const calls = [];
  const db = {
    configured: true,
    url: "https://project.supabase.co",
    key: "PUBLIC",
    authenticate: async (token) => {
      if (token !== "valid") throw new ApiError(401, "Please sign in.");
      return { id, role: "customer" };
    },
    rows: async () => [],
    rpc: async (name, args, token) => {
      calls.push({ name, args, token });
      return { id, total: 3500 };
    },
  };
  const server = createApp({ db }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const post = (path, body, token = "valid", headers = {}) =>
    fetch(base + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        ...headers,
      },
      body: JSON.stringify(body),
    });
  try {
    assert.equal((await post("/api/orders", {}, "forged")).status, 401);
    assert.equal(
      (
        await post("/api/admin/actions", {
          action: "profile",
          id,
          data: { role: "admin" },
        })
      ).status,
      403,
    );
    for (const quantity of [-1, 1.5, 51, "2"])
      assert.equal(
        (await post("/api/cart", { itemId: id, quantity })).status,
        400,
      );
    for (const items of [
      [],
      [null],
      [{ itemId: id, quantity: -1 }],
      [{ itemId: "bad", quantity: 1 }],
    ])
      assert.equal(
        (await post("/api/cart/merge", { importKey: id, items })).status,
        400,
      );
    assert.equal(
      (
        await post("/api/orders", {
          quoteId: id,
          paymentMethod: "airtel_money",
        })
      ).status,
      409,
    );
    assert.equal((await post("/api/payments/moov_money", {})).status, 503);
    assert.equal(
      (
        await post(
          "/api/orders",
          {
            quoteId: id,
            paymentMethod: "cash_on_delivery",
            total: 1,
            price: 1,
          },
          "valid",
          { "Idempotency-Key": id },
        )
      ).status,
      201,
    );
    assert.deepEqual(calls[0], {
      name: "checkout",
      args: { p_quote: id, p_key: id, p_method: "cash_on_delivery" },
      token: "valid",
    });
    assert.equal(
      (
        await post("/api/cart/merge", {
          importKey: id,
          items: [{ itemId: id, quantity: 2, price: 1, total: 1 }],
        })
      ).status,
      200,
    );
    assert.deepEqual(calls[1], {
      name: "merge_guest_cart",
      args: { p_key: id, p_items: [{ itemId: id, quantity: 2 }] },
      token: "valid",
    });
    const config = await (await fetch(base + "/api/config")).json();
    assert.equal(JSON.stringify(config).includes("SERVICE"), false);
    const cors = await fetch(base + "/health", {
      headers: { Origin: "https://untrusted.example" },
    });
    assert.equal(cors.headers.get("access-control-allow-origin"), null);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("secure PIN onboarding requires verification and stores only a server hash", async () => {
  const calls = [];
  let user = {
    id,
    role: "customer",
    email_verified: true,
    phone_verified: false,
    onboarding_complete: false,
  };
  const db = {
    configured: true,
    authenticate: async () => user,
    rpc: async (...args) => {
      calls.push(args);
      return { onboarding_complete: true };
    },
  };
  const server = createApp({
    env: { FAMINA_PIN_PEPPER: "p".repeat(32) },
    db,
  }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const postPin = (pin) =>
    fetch(base + "/api/auth/pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer valid",
      },
      body: JSON.stringify({ pin }),
    });
  try {
    assert.equal((await postPin("12345")).status, 400);
    assert.equal(calls.length, 0);

    user = { ...user, email_verified: false };
    assert.equal((await postPin("123456")).status, 403);
    assert.equal(calls.length, 0);

    user = { ...user, phone_verified: true };
    const response = await postPin("123456");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { onboarding_complete: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "set_secure_pin");
    assert.equal(calls[0][1].p_user, id);
    assert.match(calls[0][1].p_pin_hash, /^[0-9a-f]{128}$/);
    assert.match(calls[0][1].p_pin_salt, /^[0-9a-f]{32}$/);
    assert.notEqual(calls[0][1].p_pin_hash, "123456");
    assert.equal(calls[0][2], null);
    assert.equal(calls[0][3], true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("PIN onboarding fails closed when the server pepper is missing", async () => {
  const db = {
    configured: true,
    authenticate: async () => ({
      id,
      role: "customer",
      phone_verified: true,
      onboarding_complete: false,
    }),
    rpc: async () => assert.fail("must not persist an unpeppered PIN"),
  };
  const server = createApp({ env: {}, db }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    const response = await fetch(
      "http://127.0.0.1:" + server.address().port + "/api/auth/pin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid",
        },
        body: JSON.stringify({ pin: "123456" }),
      },
    );
    assert.equal(response.status, 503);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("Supabase identity is verified remotely and database requests use user tokens", async () => {
  const calls = [];
  const db = createSupabase(
    {
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_ANON_KEY: "PUBLIC",
      SUPABASE_SERVICE_ROLE_KEY: "SERVER_SECRET",
    },
    async (url, init) => {
      calls.push({ url, init });
      return Response.json(
        url.endsWith("/auth/v1/user")
          ? {
              id,
              email: "test@example.test",
              email_confirmed_at: "2026-01-01T00:00:00Z",
            }
          : [{ id, active: true, role: "customer" }],
      );
    },
  );
  const user = await db.authenticate("SIGNED_USER_TOKEN");
  assert.equal(user.id, id);
  assert.equal(user.email_verified, true);
  assert.equal(user.phone_verified, false);
  assert(
    calls.every(
      (c) =>
        c.init.headers.apikey === "PUBLIC" &&
        c.init.headers.Authorization === "Bearer SIGNED_USER_TOKEN",
    ),
  );
  await db.rpc("create_quote", {}, null, true);
  assert.equal(calls[2].init.headers.apikey, "SERVER_SECRET");
  await assert.rejects(db.authenticate(""), (e) => e.status === 401);
});
test("verified Supabase users recover a missing profile without widening RLS", async () => {
  const calls = [];
  const db = createSupabase(
    {
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_ANON_KEY: "PUBLIC",
      SUPABASE_SERVICE_ROLE_KEY: "SERVER_SECRET",
    },
    async (url, init) => {
      calls.push({url, init});
      if (url.endsWith("/auth/v1/user"))
        return Response.json({
          id,
          email: "verified@example.test",
          email_confirmed_at: "2026-11-27T00:00:00Z",
          user_metadata: {name: "  Customer  ", role: "admin"},
        });
      if (url.includes("on_conflict=id"))
        return new Response(null, {status: 204});
      if (init.headers.apikey === "SERVER_SECRET")
        return Response.json([{id, active: true, role: "customer", name: "Customer"}]);
      return Response.json([]);
    },
  );
  const user = await db.authenticate("VERIFIED_TOKEN");
  assert.equal(user.id, id);
  assert.equal(user.email_verified, true);
  const create = calls.find(({url}) => url.includes("on_conflict=id"));
  assert(create);
  assert.equal(create.init.headers.apikey, "SERVER_SECRET");
  assert.equal(create.init.headers.Prefer, "resolution=ignore-duplicates,return=minimal");
  assert.deepEqual(JSON.parse(create.init.body), {
    id,
    name: "Customer",
    phone: null,
    role: "customer",
    active: true,
  });
});
test("unverified Supabase users cannot create a profile during recovery", async () => {
  const calls = [];
  const db = createSupabase(
    {
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_ANON_KEY: "PUBLIC",
      SUPABASE_SERVICE_ROLE_KEY: "SERVER_SECRET",
    },
    async (url, init) => {
      calls.push({url, init});
      if (url.endsWith("/auth/v1/user"))
        return Response.json({id, email: "pending@example.test"});
      return Response.json([]);
    },
  );
  await assert.rejects(db.authenticate("UNVERIFIED_TOKEN"), (error) => error.status === 403);
  assert.equal(calls.some(({url}) => url.includes("on_conflict=id")), false);
});
test("routing never fabricates road distance or falls back to live GPS", async () => {
  const a = { latitude: 13.83, longitude: 20.83 },
    b = { latitude: 13.84, longitude: 20.84 };
  await assert.rejects(roadRoute(a, b, {}), /not configured/);
  await assert.rejects(
    roadRoute(a, b, { ROUTING_BASE_URL: "https://routing.example" }, async () =>
      Response.json({ code: "NoRoute" }),
    ),
    /No supported road/,
  );
  const result = await roadRoute(
    a,
    b,
    { ROUTING_BASE_URL: "https://routing.example" },
    async () =>
      Response.json({
        code: "Ok",
        routes: [
          {
            distance: 2500.2,
            duration: 600.1,
            geometry: {
              type: "LineString",
              coordinates: [
                [20.83, 13.83],
                [20.84, 13.84],
              ],
            },
          },
        ],
      }),
  );
  assert.equal(result.distance, 2501);
  assert.equal(result.duration, 601);
  for (const provider of Object.values(providers)) {
    assert.equal(provider.enabled, false);
    await assert.rejects(provider.initiate(), /not activated/);
    await assert.rejects(provider.verifyWebhook(), /not configured/);
    await assert.rejects(provider.refund(), /not activated/);
  }
});
test("unconfigured API starts but fails closed for business operations", async () => {
  const server = createApp({ env: {} }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    assert.equal((await fetch(base + "/health")).status, 200);
    assert.equal((await fetch(base + "/api/menu")).status, 503);
    assert.equal((await fetch(base + "/api/orders")).status, 401);
  } finally {
    await new Promise((r) => server.close(r));
  }
});

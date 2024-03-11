import { hasInjectionContext, inject, version, ref, watchEffect, watch, getCurrentInstance, h, toRef, isRef, defineComponent, provide, createElementBlock, defineAsyncComponent, computed, unref, Suspense, nextTick, mergeProps, Transition, useSSRContext, useAttrs, toValue, onUnmounted, resolveComponent, withAsyncContext, createVNode, resolveDynamicComponent, withCtx, renderSlot, openBlock, createBlock, createCommentVNode, toDisplayString, createApp, effectScope, reactive, isReactive, toRaw, getCurrentScope, onScopeDispose, onErrorCaptured, onServerPrefetch, shallowRef, shallowReactive, isReadonly, toRefs, markRaw, isShallow, createSlots, renderList } from 'vue';
import { d as useRuntimeConfig$1, $ as $fetch, h as createError$1, l as defuFn, m as klona, n as defu, o as hasProtocol, j as joinURL, p as parseURL, q as parseQuery, r as createDefu, t as isEqual, v as createHooks, w as withQuery, x as isScriptProtocol, y as withTrailingSlash, z as withoutTrailingSlash, A as sanitizeStatusCode, B as parse, C as getRequestHeader, D as destr, E as setCookie, F as getCookie, G as deleteCookie } from '../runtime.mjs';
import { getActiveHead } from 'unhead';
import { defineHeadPlugin, composableNames } from '@unhead/shared';
import { useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { createSharedComposable } from '@vueuse/core';
import { extendTailwindMerge, twMerge, twJoin } from 'tailwind-merge';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderVNode, ssrRenderSlot, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrRenderSuspense, ssrRenderTeleport } from 'vue/server-renderer';
import { Icon as Icon$1 } from '@iconify/vue/dist/offline';
import { addAPIProvider, loadIcon } from '@iconify/vue';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'ipx';

function createContext$1(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers$1.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers$1.delete(onLeave);
      }
    }
  };
}
function createNamespace$1(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext$1({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey$2 = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey$2] || (_globalThis$1[globalKey$2] = createNamespace$1());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey$1 = "__unctx_async_handlers__";
const asyncHandlers$1 = _globalThis$1[asyncHandlersKey$1] || (_globalThis$1[asyncHandlersKey$1] = /* @__PURE__ */ new Set());

const appConfig$1 = useRuntimeConfig$1().app;
const baseURL = () => appConfig$1.baseURL;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app", {
  asyncContext: false
});
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.10.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      once: /* @__PURE__ */ new Set(),
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn)),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
// @__NO_SIDE_EFFECTS__
function tryUseNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  return nuxtAppInstance || null;
}
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  const nuxtAppInstance = /* @__PURE__ */ tryUseNuxtApp();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config2) {
  return config2;
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const protocol = parseURL(toPath).protocol;
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error2 = useError();
    if (false)
      ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && "production" !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
function useHead(input2, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input2, options);
    return head.push(input2, options);
  }
}
function clientUseHead(head, input2, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input2);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => (/* @__PURE__ */ useNuxtApp()).vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const _routes = [
  {
    name: "cart",
    path: "/cart",
    meta: {},
    alias: [],
    redirect: void 0 ,
    component: () => import('./index-B8tGJP8N.mjs').then((m) => m.default || m)
  },
  {
    name: "index",
    path: "/",
    meta: {},
    alias: [],
    redirect: void 0 ,
    component: () => import('./index-C_w7a__2.mjs').then((m) => m.default || m)
  },
  {
    name: "product-product",
    path: "/product/:product()",
    meta: {},
    alias: [],
    redirect: void 0 ,
    component: () => import('./_product_-DCSb2j3x.mjs').then((m) => m.default || m)
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": true };
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise((resolve2) => setTimeout(resolve2, 0));
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const cfg0 = defineAppConfig({
  ui: {
    primary: "purple"
  }
});
const inlineConfig = {
  "nuxt": {
    "buildId": "21d43ed7-edc8-4f36-8509-86b0975dbe11"
  },
  "ui": {
    "primary": "green",
    "gray": "cool",
    "colors": [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "primary"
    ],
    "strategy": "merge"
  }
};
const appConfig = /* @__PURE__ */ defuFn(cfg0, inlineConfig);
function useAppConfig() {
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = klona(appConfig);
  }
  return nuxtApp._appConfig;
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from, failure) => {
      delete nuxtApp._processingMiddleware;
      if (failure) {
        await nuxtApp.callHook("page:loading:end");
      }
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        const to = router.resolve(initialURL);
        if ("name" in to) {
          to.name = void 0;
        }
        await router.replace({
          ...to,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const isVue2 = false;
/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (!("production" !== "production") )) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
    // flush: 'post',
  };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (!("production" !== "production") )) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(setup)));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (pinia) || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function mapWritableState(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
    reduced[key] = {
      get() {
        return useStore(this.$pinia)[key];
      },
      set(value) {
        return useStore(this.$pinia)[key] = value;
      }
    };
    return reduced;
  }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
    reduced[key] = {
      get() {
        return useStore(this.$pinia)[keysOrMapper[key]];
      },
      set(value) {
        return useStore(this.$pinia)[keysOrMapper[key]] = value;
      }
    };
    return reduced;
  }, {});
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp = /* @__PURE__ */ useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function resolveTrailingSlashBehavior(to, resolve) {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, options.trailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      path: applyTrailingSlashBehavior(path, options.trailingSlash)
    };
    if ("name" in resolvedPath) {
      delete resolvedPath.name;
    }
    return resolvedPath;
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const config2 = /* @__PURE__ */ useRuntimeConfig();
      const to = computed(() => {
        const path = props.to || props.href || "";
        return resolveTrailingSlashBehavior(path, router.resolve);
      });
      const isAbsoluteUrl = computed(() => typeof to.value === "string" && hasProtocol(to.value, { acceptRelative: true }));
      const hasTarget = computed(() => props.target && props.target !== "_self");
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (hasTarget.value) {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || isAbsoluteUrl.value;
      });
      const prefetched = ref(false);
      const el = void 0;
      const elRef = void 0;
      return () => {
        var _a, _b;
        if (!isExternal.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const href = typeof to.value === "object" ? ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null : to.value && !props.external && !isAbsoluteUrl.value ? resolveTrailingSlashBehavior(joinURL(config2.app.baseURL, to.value), router.resolve) : to.value || null;
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          const navigate = () => navigateTo(href, { replace: props.replace, external: props.external });
          return slots.default({
            href,
            navigate,
            get route() {
              if (!href) {
                return void 0;
              }
              const url = parseURL(href);
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href
              };
            },
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_b = slots.default) == null ? void 0 : _b.call(slots));
      };
    }
  });
}
const __nuxt_component_0$4 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const plugin = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  setActivePinia(pinia);
  {
    nuxtApp.payload.pinia = pinia.state.value;
  }
  return {
    provide: {
      pinia
    }
  };
});
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(function() {
  return Icon;
}).then((r) => r.default));
const LazyIconCSS = defineAsyncComponent(() => import('./IconCSS-DGZrOvLb.mjs').then((r) => r.default));
const lazyGlobalComponents = [
  ["Icon", LazyIcon],
  ["IconCSS", LazyIconCSS]
];
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const modalInjectionKey = Symbol("nuxt-ui.modal");
function _useModal() {
  const modalState = inject(modalInjectionKey);
  const isOpen = ref(false);
  function open(component, props) {
    modalState.value = {
      component,
      props: props ?? {}
    };
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
    modalState.value = {
      component: "div",
      props: {}
    };
  }
  function patch(props) {
    modalState.value = {
      ...modalState.value,
      props: {
        ...modalState.value.props,
        ...props
      }
    };
  }
  return {
    isOpen,
    open,
    close,
    patch
  };
}
createSharedComposable(_useModal);
const modals_bidRKewKK5 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const modalState = shallowRef({
    component: "div",
    props: {}
  });
  nuxtApp.vueApp.provide(modalInjectionKey, modalState);
});
function omit(object, keysToOmit) {
  const result = { ...object };
  for (const key of keysToOmit) {
    delete result[key];
  }
  return result;
}
function get(object, path, defaultValue) {
  if (typeof path === "string") {
    path = path.split(".").map((key) => {
      const numKey = Number(key);
      return isNaN(numKey) ? key : numKey;
    });
  }
  let result = object;
  for (const key of path) {
    if (result === void 0 || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  return result !== void 0 ? result : defaultValue;
}
const nuxtLinkProps = {
  to: {
    type: [String, Object],
    default: void 0,
    required: false
  },
  href: {
    type: [String, Object],
    default: void 0,
    required: false
  },
  // Attributes
  target: {
    type: String,
    default: void 0,
    required: false
  },
  rel: {
    type: String,
    default: void 0,
    required: false
  },
  noRel: {
    type: Boolean,
    default: void 0,
    required: false
  },
  // Prefetching
  prefetch: {
    type: Boolean,
    default: void 0,
    required: false
  },
  noPrefetch: {
    type: Boolean,
    default: void 0,
    required: false
  },
  // Styling
  activeClass: {
    type: String,
    default: void 0,
    required: false
  },
  exactActiveClass: {
    type: String,
    default: void 0,
    required: false
  },
  prefetchedClass: {
    type: String,
    default: void 0,
    required: false
  },
  // Vue Router's `<RouterLink>` additional props
  replace: {
    type: Boolean,
    default: void 0,
    required: false
  },
  ariaCurrentValue: {
    type: String,
    default: void 0,
    required: false
  },
  // Edge cases handling
  external: {
    type: Boolean,
    default: void 0,
    required: false
  }
};
const uLinkProps = {
  as: {
    type: String,
    default: "button"
  },
  type: {
    type: String,
    default: "button"
  },
  disabled: {
    type: Boolean,
    default: null
  },
  active: {
    type: Boolean,
    default: void 0
  },
  exact: {
    type: Boolean,
    default: false
  },
  exactQuery: {
    type: Boolean,
    default: false
  },
  exactHash: {
    type: Boolean,
    default: false
  },
  inactiveClass: {
    type: String,
    default: void 0
  }
};
const getNuxtLinkProps = (props) => {
  const keys = Object.keys(nuxtLinkProps);
  return keys.reduce((acc, key) => {
    if (props[key] !== void 0) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
};
const getULinkProps = (props) => {
  const keys = [...Object.keys(nuxtLinkProps), ...Object.keys(uLinkProps)];
  return keys.reduce((acc, key) => {
    if (props[key] !== void 0) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
};
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      icons: [(classPart) => /^i-/.test(classPart)]
    }
  }
});
const defuTwMerge = createDefu((obj, key, value, namespace) => {
  if (namespace === "default" || namespace.startsWith("default.")) {
    return false;
  }
  if (namespace === "popper" || namespace.startsWith("popper.")) {
    return false;
  }
  if (namespace.endsWith("avatar") && key === "size") {
    return false;
  }
  if (namespace.endsWith("chip") && key === "size") {
    return false;
  }
  if (namespace.endsWith("badge") && key === "size" || key === "color" || key === "variant") {
    return false;
  }
  if (typeof obj[key] === "string" && typeof value === "string" && obj[key] && value) {
    obj[key] = customTwMerge(obj[key], value);
    return true;
  }
});
function mergeConfig(strategy, ...configs) {
  if (strategy === "override") {
    return defu({}, ...configs);
  }
  return defuTwMerge({}, ...configs);
}
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(_, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
}
function getSlotsChildren(slots) {
  var _a;
  let children = (_a = slots.default) == null ? void 0 : _a.call(slots);
  if (children == null ? void 0 : children.length) {
    children = children.flatMap((c) => {
      var _a2, _b;
      if (typeof c.type === "symbol") {
        if (typeof c.children === "string") {
          return;
        }
        return c.children;
      } else if (c.type.name === "ContentSlot") {
        return (_b = (_a2 = c.ctx.slots).default) == null ? void 0 : _b.call(_a2);
      }
      return c;
    }).filter(Boolean);
  }
  return children || [];
}
function looseToNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
}
const _inherit = "inherit";
const _current = "currentColor";
const _transparent = "transparent";
const _black = "#000";
const _white = "#fff";
const _slate = { "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1", "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155", "800": "#1e293b", "900": "#0f172a", "950": "#020617" };
const _gray = { "50": "rgb(var(--color-gray-50) / <alpha-value>)", "100": "rgb(var(--color-gray-100) / <alpha-value>)", "200": "rgb(var(--color-gray-200) / <alpha-value>)", "300": "rgb(var(--color-gray-300) / <alpha-value>)", "400": "rgb(var(--color-gray-400) / <alpha-value>)", "500": "rgb(var(--color-gray-500) / <alpha-value>)", "600": "rgb(var(--color-gray-600) / <alpha-value>)", "700": "rgb(var(--color-gray-700) / <alpha-value>)", "800": "rgb(var(--color-gray-800) / <alpha-value>)", "900": "rgb(var(--color-gray-900) / <alpha-value>)", "950": "rgb(var(--color-gray-950) / <alpha-value>)" };
const _zinc = { "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8", "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46", "800": "#27272a", "900": "#18181b", "950": "#09090b" };
const _neutral = { "50": "#fafafa", "100": "#f5f5f5", "200": "#e5e5e5", "300": "#d4d4d4", "400": "#a3a3a3", "500": "#737373", "600": "#525252", "700": "#404040", "800": "#262626", "900": "#171717", "950": "#0a0a0a" };
const _stone = { "50": "#fafaf9", "100": "#f5f5f4", "200": "#e7e5e4", "300": "#d6d3d1", "400": "#a8a29e", "500": "#78716c", "600": "#57534e", "700": "#44403c", "800": "#292524", "900": "#1c1917", "950": "#0c0a09" };
const _red = { "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5", "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c", "800": "#991b1b", "900": "#7f1d1d", "950": "#450a0a" };
const _orange = { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12", "950": "#431407" };
const _amber = { "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d", "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "800": "#92400e", "900": "#78350f", "950": "#451a03" };
const _yellow = { "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047", "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207", "800": "#854d0e", "900": "#713f12", "950": "#422006" };
const _lime = { "50": "#f7fee7", "100": "#ecfccb", "200": "#d9f99d", "300": "#bef264", "400": "#a3e635", "500": "#84cc16", "600": "#65a30d", "700": "#4d7c0f", "800": "#3f6212", "900": "#365314", "950": "#1a2e05" };
const _green = { "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac", "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d", "800": "#166534", "900": "#14532d", "950": "#052e16" };
const _emerald = { "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "800": "#065f46", "900": "#064e3b", "950": "#022c22" };
const _teal = { "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4", "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e", "800": "#115e59", "900": "#134e4a", "950": "#042f2e" };
const _cyan = { "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "800": "#155e75", "900": "#164e63", "950": "#083344" };
const _sky = { "50": "#f0f9ff", "100": "#e0f2fe", "200": "#bae6fd", "300": "#7dd3fc", "400": "#38bdf8", "500": "#0ea5e9", "600": "#0284c7", "700": "#0369a1", "800": "#075985", "900": "#0c4a6e", "950": "#082f49" };
const _blue = { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" };
const _indigo = { "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc", "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca", "800": "#3730a3", "900": "#312e81", "950": "#1e1b4b" };
const _violet = { "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd", "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9", "800": "#5b21b6", "900": "#4c1d95", "950": "#2e1065" };
const _purple = { "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe", "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce", "800": "#6b21a8", "900": "#581c87", "950": "#3b0764" };
const _fuchsia = { "50": "#fdf4ff", "100": "#fae8ff", "200": "#f5d0fe", "300": "#f0abfc", "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf", "800": "#86198f", "900": "#701a75", "950": "#4a044e" };
const _pink = { "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4", "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d", "800": "#9d174d", "900": "#831843", "950": "#500724" };
const _rose = { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "800": "#9f1239", "900": "#881337", "950": "#4c0519" };
const _primary = { "50": "rgb(var(--color-primary-50) / <alpha-value>)", "100": "rgb(var(--color-primary-100) / <alpha-value>)", "200": "rgb(var(--color-primary-200) / <alpha-value>)", "300": "rgb(var(--color-primary-300) / <alpha-value>)", "400": "rgb(var(--color-primary-400) / <alpha-value>)", "500": "rgb(var(--color-primary-500) / <alpha-value>)", "600": "rgb(var(--color-primary-600) / <alpha-value>)", "700": "rgb(var(--color-primary-700) / <alpha-value>)", "800": "rgb(var(--color-primary-800) / <alpha-value>)", "900": "rgb(var(--color-primary-900) / <alpha-value>)", "950": "rgb(var(--color-primary-950) / <alpha-value>)", "DEFAULT": "rgb(var(--color-primary-DEFAULT) / <alpha-value>)" };
const _cool = { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151", "800": "#1f2937", "900": "#111827", "950": "#030712" };
const config$4 = { "inherit": _inherit, "current": _current, "transparent": _transparent, "black": _black, "white": _white, "slate": _slate, "gray": _gray, "zinc": _zinc, "neutral": _neutral, "stone": _stone, "red": _red, "orange": _orange, "amber": _amber, "yellow": _yellow, "lime": _lime, "green": _green, "emerald": _emerald, "teal": _teal, "cyan": _cyan, "sky": _sky, "blue": _blue, "indigo": _indigo, "violet": _violet, "purple": _purple, "fuchsia": _fuchsia, "pink": _pink, "rose": _rose, "primary": _primary, "cool": _cool };
const colors_244lXBzhnM = /* @__PURE__ */ defineNuxtPlugin(() => {
  const appConfig2 = useAppConfig();
  const root = computed(() => {
    const primary = config$4[appConfig2.ui.primary];
    const gray = config$4[appConfig2.ui.gray];
    if (!primary) {
      console.warn(`[@nuxt/ui] Primary color '${appConfig2.ui.primary}' not found in Tailwind config`);
    }
    if (!gray) {
      console.warn(`[@nuxt/ui] Gray color '${appConfig2.ui.gray}' not found in Tailwind config`);
    }
    return `:root {
${Object.entries(primary || config$4.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join("\n")}
--color-primary-DEFAULT: var(--color-primary-500);

${Object.entries(gray || config$4.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join("\n")}
}

.dark {
  --color-primary-DEFAULT: var(--color-primary-400);
}
`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: "nuxt-ui-colors"
    }]
  };
  useHead(headData);
});
const preference = "system";
const plugin_server_XNCxeHyTuP = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  var _a;
  const colorMode = ((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
function usePersistedstateCookies(cookieOptions) {
  return {
    getItem: (key) => {
      return useCookie(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent
      }).value;
    },
    setItem: (key, value) => {
      useCookie(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent
      }).value = value;
    }
  };
}
function usePersistedstateLocalStorage() {
  return {
    getItem: (key) => {
      return !(/* @__PURE__ */ useNuxtApp()).ssrContext ? localStorage.getItem(key) : null;
    },
    setItem: (key, value) => {
      if (!(/* @__PURE__ */ useNuxtApp()).ssrContext)
        localStorage.setItem(key, value);
    }
  };
}
function usePersistedstateSessionStorage() {
  return {
    getItem: (key) => {
      return !(/* @__PURE__ */ useNuxtApp()).ssrContext ? sessionStorage.getItem(key) : null;
    },
    setItem: (key, value) => {
      if (!(/* @__PURE__ */ useNuxtApp()).ssrContext)
        sessionStorage.setItem(key, value);
    }
  };
}
const persistedState = {
  localStorage: usePersistedstateLocalStorage(),
  sessionStorage: usePersistedstateSessionStorage(),
  cookies: usePersistedstateCookies(),
  cookiesWithOptions: usePersistedstateCookies
};
const plugin_1UohGbtF8v = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const {
    cookieOptions,
    debug,
    storage
  } = (/* @__PURE__ */ useRuntimeConfig()).public.persistedState;
  const pinia = nuxtApp.$pinia;
  pinia.use(createPersistedState({
    storage: storage === "cookies" ? persistedState.cookiesWithOptions(cookieOptions) : persistedState[storage],
    debug
  }));
});
const plugins = [
  unhead_KgADcZ0jPj,
  plugin$1,
  plugin,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  modals_bidRKewKK5,
  colors_244lXBzhnM,
  plugin_server_XNCxeHyTuP,
  plugin_1UohGbtF8v
];
function defaultEstimatedProgress(duration, elapsed) {
  const completionPercentage = elapsed / duration * 100;
  return 2 / Math.PI * 100 * Math.atan(completionPercentage / 50);
}
function createLoadingIndicator(opts = {}) {
  const { duration = 2e3, throttle = 200 } = opts;
  opts.estimatedProgress || defaultEstimatedProgress;
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const progress = ref(0);
  const isLoading = ref(false);
  let _throttle = null;
  const start = () => set2(0);
  function set2(at = 0) {
    if (nuxtApp.isHydrating) {
      return;
    }
    if (at >= 100) {
      return finish();
    }
    clear();
    progress.value = at < 0 ? 0 : at;
    if (throttle && false) {
      _throttle = setTimeout(() => {
        isLoading.value = true;
      }, throttle);
    } else {
      isLoading.value = true;
    }
  }
  function finish() {
    progress.value = 100;
    clear();
  }
  function clear() {
    clearTimeout(_throttle);
    _throttle = null;
  }
  let _cleanup = () => {
  };
  return {
    _cleanup,
    progress: computed(() => progress.value),
    isLoading: computed(() => isLoading.value),
    start,
    set: set2,
    finish,
    clear
  };
}
function useLoadingIndicator(opts = {}) {
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const indicator = nuxtApp._loadingIndicator = nuxtApp._loadingIndicator || createLoadingIndicator(opts);
  return indicator;
}
const __nuxt_component_0$3 = defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    height: {
      type: Number,
      default: 3
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    },
    estimatedProgress: {
      type: Function,
      required: false
    }
  },
  setup(props, { slots, expose }) {
    const { progress, isLoading, start, finish, clear } = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle,
      estimatedProgress: props.estimatedProgress
    });
    expose({
      progress,
      isLoading,
      start,
      finish,
      clear
    });
    return () => h("div", {
      class: "nuxt-loading-indicator",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        pointerEvents: "none",
        width: "auto",
        height: `${props.height}px`,
        opacity: isLoading.value ? 1 : 0,
        background: props.color || void 0,
        backgroundSize: `${100 / progress.value * 100}% auto`,
        transform: `scaleX(${progress.value}%)`,
        transformOrigin: "left",
        transition: "transform 0.1s, height 0.4s, opacity 0.4s",
        zIndex: 999999
      }
    }, slots);
  }
});
const layouts = {
  default: () => import('./default-Hw1PxlXV.mjs').then((m) => m.default || m)
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_1$2 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const iconCollections = ["fluent-emoji-high-contrast", "material-symbols-light", "cryptocurrency-color", "icon-park-outline", "icon-park-twotone", "fluent-emoji-flat", "emojione-monotone", "streamline-emojis", "heroicons-outline", "simple-line-icons", "material-symbols", "flat-color-icons", "icon-park-solid", "pepicons-pencil", "heroicons-solid", "pepicons-print", "cryptocurrency", "pixelarticons", "system-uicons", "bitcoin-icons", "devicon-plain", "entypo-social", "grommet-icons", "vscode-icons", "pepicons-pop", "svg-spinners", "fluent-emoji", "simple-icons", "circle-flags", "medical-icon", "icomoon-free", "majesticons", "radix-icons", "humbleicons", "fa6-regular", "emojione-v1", "skill-icons", "academicons", "healthicons", "fluent-mdl2", "teenyicons", "ant-design", "gravity-ui", "akar-icons", "lets-icons", "streamline", "fa6-brands", "file-icons", "game-icons", "foundation", "fa-regular", "mono-icons", "iconamoon", "zondicons", "mdi-light", "eos-icons", "gridicons", "icon-park", "heroicons", "fa6-solid", "meteocons", "arcticons", "dashicons", "fa-brands", "websymbol", "fontelico", "mingcute", "flowbite", "bytesize", "guidance", "openmoji", "emojione", "nonicons", "brandico", "flagpack", "fa-solid", "fontisto", "si-glyph", "pepicons", "iconoir", "tdesign", "clarity", "octicon", "codicon", "pajamas", "formkit", "line-md", "twemoji", "noto-v1", "fxemoji", "devicon", "raphael", "flat-ui", "topcoat", "feather", "tabler", "carbon", "lucide", "memory", "mynaui", "circum", "fluent", "nimbus", "entypo", "icons8", "subway", "vaadin", "solar", "basil", "typcn", "charm", "prime", "quill", "logos", "covid", "maki", "gala", "mage", "ooui", "noto", "flag", "iwwa", "zmdi", "bpmn", "mdi", "ion", "uil", "bxs", "cil", "uiw", "uim", "uit", "uis", "jam", "oui", "bxl", "cib", "cbi", "cif", "gis", "map", "geo", "fad", "eva", "wpf", "whh", "ic", "ph", "ri", "bi", "bx", "gg", "ci", "ep", "fe", "mi", "f7", "ei", "wi", "la", "fa", "oi", "et", "el", "ls", "vs", "il", "ps"];
function resolveIconName(name = "") {
  let prefix;
  let provider = "";
  if (name[0] === "@" && name.includes(":")) {
    provider = name.split(":")[0].slice(1);
    name = name.split(":").slice(1).join(":");
  }
  if (name.startsWith("i-")) {
    name = name.replace(/^i-/, "");
    for (const collectionName of iconCollections) {
      if (name.startsWith(collectionName)) {
        prefix = collectionName;
        name = name.slice(collectionName.length + 1);
        break;
      }
    }
  } else if (name.includes(":")) {
    const [_prefix, _name] = name.split(":");
    prefix = _prefix;
    name = _name;
  }
  return {
    provider,
    prefix: prefix || "",
    name: name || ""
  };
}
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ""
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const appConfig2 = useAppConfig();
    const props = __props;
    watch(() => {
      var _a;
      return (_a = appConfig2.nuxtIcon) == null ? void 0 : _a.iconifyApiOptions;
    }, () => {
      var _a, _b, _c, _d, _e, _f;
      if (!((_b = (_a = appConfig2.nuxtIcon) == null ? void 0 : _a.iconifyApiOptions) == null ? void 0 : _b.url))
        return;
      try {
        new URL(appConfig2.nuxtIcon.iconifyApiOptions.url);
      } catch (e) {
        console.warn("Nuxt Icon: Invalid custom Iconify API URL");
        return;
      }
      if ((_d = (_c = appConfig2.nuxtIcon) == null ? void 0 : _c.iconifyApiOptions) == null ? void 0 : _d.publicApiFallback) {
        addAPIProvider("custom", {
          resources: [(_e = appConfig2.nuxtIcon) == null ? void 0 : _e.iconifyApiOptions.url],
          index: 0
        });
        return;
      }
      addAPIProvider("", {
        resources: [(_f = appConfig2.nuxtIcon) == null ? void 0 : _f.iconifyApiOptions.url]
      });
    }, { immediate: true });
    const state = useState("icons", () => ({}));
    const isFetching = ref(false);
    const iconName = computed(() => {
      var _a, _b;
      if ((_b = (_a = appConfig2.nuxtIcon) == null ? void 0 : _a.aliases) == null ? void 0 : _b[props.name]) {
        return appConfig2.nuxtIcon.aliases[props.name];
      }
      return props.name;
    });
    const resolvedIcon = computed(() => resolveIconName(iconName.value));
    const iconKey = computed(() => [resolvedIcon.value.provider, resolvedIcon.value.prefix, resolvedIcon.value.name].filter(Boolean).join(":"));
    const icon = computed(() => {
      var _a;
      return (_a = state.value) == null ? void 0 : _a[iconKey.value];
    });
    const component = computed(() => nuxtApp.vueApp.component(iconName.value));
    const sSize = computed(() => {
      var _a, _b, _c;
      if (!props.size && typeof ((_a = appConfig2.nuxtIcon) == null ? void 0 : _a.size) === "boolean" && !((_b = appConfig2.nuxtIcon) == null ? void 0 : _b.size)) {
        return void 0;
      }
      const size = props.size || ((_c = appConfig2.nuxtIcon) == null ? void 0 : _c.size) || "1em";
      if (String(Number(size)) === size) {
        return `${size}px`;
      }
      return size;
    });
    const className = computed(() => {
      var _a;
      return ((_a = appConfig2 == null ? void 0 : appConfig2.nuxtIcon) == null ? void 0 : _a.class) ?? "icon";
    });
    async function loadIconComponent() {
      var _a;
      if (component.value) {
        return;
      }
      if (!((_a = state.value) == null ? void 0 : _a[iconKey.value])) {
        isFetching.value = true;
        state.value[iconKey.value] = await loadIcon(resolvedIcon.value).catch(() => void 0);
        isFetching.value = false;
      }
    }
    watch(iconName, loadIconComponent);
    !component.value && ([__temp, __restore] = withAsyncContext(() => loadIconComponent()), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      if (isFetching.value) {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: className.value,
          style: { width: sSize.value, height: sSize.value }
        }, _attrs))} data-v-46c2e1f1></span>`);
      } else if (icon.value) {
        _push(ssrRenderComponent(unref(Icon$1), mergeProps({
          icon: icon.value,
          class: className.value,
          width: sSize.value,
          height: sSize.value
        }, _attrs), null, _parent));
      } else if (component.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(component.value), mergeProps({
          class: className.value,
          width: sSize.value,
          height: sSize.value
        }, _attrs), null), _parent);
      } else {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: className.value,
          style: { fontSize: sSize.value, lineHeight: sSize.value, width: sSize.value, height: sSize.value }
        }, _attrs))} data-v-46c2e1f1>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, () => {
          _push(`${ssrInterpolate(__props.name)}`);
        }, _push, _parent);
        _push(`</span>`);
      }
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-icon/dist/runtime/Icon.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-46c2e1f1"]]);
const Icon = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: __nuxt_component_0$2
});
const _sfc_main$8 = defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    dynamic: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const appConfig2 = useAppConfig();
    const dynamic = computed(() => {
      var _a, _b;
      return props.dynamic || ((_b = (_a = appConfig2.ui) == null ? void 0 : _a.icons) == null ? void 0 : _b.dynamic);
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      dynamic
    };
  }
});
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0$2;
  if (_ctx.dynamic) {
    _push(ssrRenderComponent(_component_Icon, mergeProps({ name: _ctx.name }, _attrs), null, _parent));
  } else {
    _push(`<span${ssrRenderAttrs(mergeProps({ class: _ctx.name }, _attrs))}></span>`);
  }
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Icon.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$6]]);
const useUI = (key, $ui, $config, $wrapperClass, withAppConfig = false) => {
  const $attrs = useAttrs();
  const appConfig2 = useAppConfig();
  const ui = computed(() => {
    var _a;
    const _ui = toValue($ui);
    const _config = toValue($config);
    const _wrapperClass = toValue($wrapperClass);
    return mergeConfig(
      (_ui == null ? void 0 : _ui.strategy) || ((_a = appConfig2.ui) == null ? void 0 : _a.strategy),
      _wrapperClass ? { wrapper: _wrapperClass } : {},
      _ui || {},
      withAppConfig ? get(appConfig2.ui, key, {}) : {},
      _config || {}
    );
  });
  const attrs = computed(() => omit($attrs, ["class"]));
  return {
    ui,
    attrs
  };
};
const avatar = {
  wrapper: "relative inline-flex items-center justify-center flex-shrink-0",
  background: "bg-gray-100 dark:bg-gray-800",
  rounded: "rounded-full",
  text: "font-medium leading-none text-gray-900 dark:text-white truncate",
  placeholder: "font-medium leading-none text-gray-500 dark:text-gray-400 truncate",
  size: {
    "3xs": "h-4 w-4 text-[8px]",
    "2xs": "h-5 w-5 text-[10px]",
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-14 w-14 text-xl",
    "2xl": "h-16 w-16 text-2xl",
    "3xl": "h-20 w-20 text-3xl"
  },
  chip: {
    base: "absolute rounded-full ring-1 ring-white dark:ring-gray-900 flex items-center justify-center text-white dark:text-gray-900 font-medium",
    background: "bg-{color}-500 dark:bg-{color}-400",
    position: {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-left": "bottom-0 left-0"
    },
    size: {
      "3xs": "h-[4px] min-w-[4px] text-[4px] p-px",
      "2xs": "h-[5px] min-w-[5px] text-[5px] p-px",
      xs: "h-1.5 min-w-[0.375rem] text-[6px] p-px",
      sm: "h-2 min-w-[0.5rem] text-[7px] p-0.5",
      md: "h-2.5 min-w-[0.625rem] text-[8px] p-0.5",
      lg: "h-3 min-w-[0.75rem] text-[10px] p-0.5",
      xl: "h-3.5 min-w-[0.875rem] text-[11px] p-1",
      "2xl": "h-4 min-w-[1rem] text-[12px] p-1",
      "3xl": "h-5 min-w-[1.25rem] text-[14px] p-1"
    }
  },
  icon: {
    base: "text-gray-500 dark:text-gray-400 flex-shrink-0",
    size: {
      "3xs": "h-2 w-2",
      "2xs": "h-2.5 w-2.5",
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-7 w-7",
      "2xl": "h-8 w-8",
      "3xl": "h-10 w-10"
    }
  },
  default: {
    size: "sm",
    icon: null,
    chipColor: null,
    chipPosition: "top-right"
  }
};
const button = {
  base: "focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0",
  font: "font-medium",
  rounded: "rounded-md",
  truncate: "text-left break-all line-clamp-1",
  block: "w-full flex justify-center items-center",
  inline: "inline-flex items-center",
  size: {
    "2xs": "text-xs",
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-sm",
    xl: "text-base"
  },
  gap: {
    "2xs": "gap-x-1",
    xs: "gap-x-1.5",
    sm: "gap-x-1.5",
    md: "gap-x-2",
    lg: "gap-x-2.5",
    xl: "gap-x-2.5"
  },
  padding: {
    "2xs": "px-2 py-1",
    xs: "px-2.5 py-1.5",
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-3.5 py-2.5",
    xl: "px-3.5 py-2.5"
  },
  square: {
    "2xs": "p-1",
    xs: "p-1.5",
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
    xl: "p-2.5"
  },
  color: {
    white: {
      solid: "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      ghost: "text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
    },
    gray: {
      solid: "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      ghost: "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      link: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
    },
    black: {
      solid: "shadow-sm text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      link: "text-gray-900 dark:text-white underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
    }
  },
  variant: {
    solid: "shadow-sm text-white dark:text-gray-900 bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-{color}-400 dark:hover:bg-{color}-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400",
    outline: "ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    soft: "text-{color}-500 dark:text-{color}-400 bg-{color}-50 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-950 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    ghost: "text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    link: "text-{color}-500 hover:text-{color}-600 disabled:text-{color}-500 dark:text-{color}-400 dark:hover:text-{color}-500 dark:disabled:text-{color}-400 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400"
  },
  icon: {
    base: "flex-shrink-0",
    loading: "animate-spin",
    size: {
      "2xs": "h-4 w-4",
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-5 w-5",
      lg: "h-5 w-5",
      xl: "h-6 w-6"
    }
  },
  default: {
    size: "sm",
    variant: "solid",
    color: "primary",
    loadingIcon: "i-heroicons-arrow-path-20-solid"
  }
};
const arrow = {
  base: "invisible before:visible before:block before:rotate-45 before:z-[-1] before:w-2 before:h-2",
  ring: "before:ring-1 before:ring-gray-200 dark:before:ring-gray-800",
  rounded: "before:rounded-sm",
  background: "before:bg-gray-200 dark:before:bg-gray-800",
  shadow: "before:shadow",
  // eslint-disable-next-line quotes
  placement: `group-data-[popper-placement*='right']:-left-1 group-data-[popper-placement*='left']:-right-1 group-data-[popper-placement*='top']:-bottom-1 group-data-[popper-placement*='bottom']:-top-1`
};
const input = {
  wrapper: "relative",
  base: "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0",
  form: "form-input",
  rounded: "rounded-md",
  placeholder: "placeholder-gray-400 dark:placeholder-gray-500",
  file: {
    base: "file:cursor-pointer file:rounded-l-md file:absolute file:left-0 file:inset-y-0 file:font-medium file:m-0 file:border-0 file:ring-1 file:ring-gray-300 dark:file:ring-gray-700 file:text-gray-900 dark:file:text-white file:bg-gray-50 hover:file:bg-gray-100 dark:file:bg-gray-800 dark:hover:file:bg-gray-700/50",
    padding: {
      "2xs": "ps-[85px]",
      xs: "ps-[87px]",
      sm: "ps-[96px]",
      md: "ps-[98px]",
      lg: "ps-[100px]",
      xl: "ps-[109px]"
    }
  },
  size: {
    "2xs": "text-xs",
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-sm",
    xl: "text-base"
  },
  gap: {
    "2xs": "gap-x-1",
    xs: "gap-x-1.5",
    sm: "gap-x-1.5",
    md: "gap-x-2",
    lg: "gap-x-2.5",
    xl: "gap-x-2.5"
  },
  padding: {
    "2xs": "px-2 py-1",
    xs: "px-2.5 py-1.5",
    sm: "px-2.5 py-1.5",
    md: "px-3 py-2",
    lg: "px-3.5 py-2.5",
    xl: "px-3.5 py-2.5"
  },
  leading: {
    padding: {
      "2xs": "ps-7",
      xs: "ps-8",
      sm: "ps-9",
      md: "ps-10",
      lg: "ps-11",
      xl: "ps-12"
    }
  },
  trailing: {
    padding: {
      "2xs": "pe-7",
      xs: "pe-8",
      sm: "pe-9",
      md: "pe-10",
      lg: "pe-11",
      xl: "pe-12"
    }
  },
  color: {
    white: {
      outline: "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
    },
    gray: {
      outline: "shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
    }
  },
  variant: {
    outline: "shadow-sm bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 focus:ring-2 focus:ring-{color}-500 dark:focus:ring-{color}-400",
    none: "bg-transparent focus:ring-0 focus:shadow-none"
  },
  icon: {
    base: "flex-shrink-0 text-gray-400 dark:text-gray-500",
    color: "text-{color}-500 dark:text-{color}-400",
    loading: "animate-spin",
    size: {
      "2xs": "h-4 w-4",
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      md: "h-5 w-5",
      lg: "h-5 w-5",
      xl: "h-6 w-6"
    },
    leading: {
      wrapper: "absolute inset-y-0 start-0 flex items-center",
      pointer: "pointer-events-none",
      padding: {
        "2xs": "px-2",
        xs: "px-2.5",
        sm: "px-2.5",
        md: "px-3",
        lg: "px-3.5",
        xl: "px-3.5"
      }
    },
    trailing: {
      wrapper: "absolute inset-y-0 end-0 flex items-center",
      pointer: "pointer-events-none",
      padding: {
        "2xs": "px-2",
        xs: "px-2.5",
        sm: "px-2.5",
        md: "px-3",
        lg: "px-3.5",
        xl: "px-3.5"
      }
    }
  },
  default: {
    size: "sm",
    color: "white",
    variant: "outline",
    loadingIcon: "i-heroicons-arrow-path-20-solid"
  }
};
const inputMenu = {
  container: "z-20 group",
  trigger: "inline-flex w-full",
  width: "w-full",
  height: "max-h-60",
  base: "relative focus:outline-none overflow-y-auto scroll-py-1",
  background: "bg-white dark:bg-gray-800",
  shadow: "shadow-lg",
  rounded: "rounded-md",
  padding: "p-1",
  ring: "ring-1 ring-gray-200 dark:ring-gray-700",
  empty: "text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5",
  option: {
    base: "cursor-default select-none relative flex items-center justify-between gap-1",
    rounded: "rounded-md",
    padding: "px-1.5 py-1.5",
    size: "text-sm",
    color: "text-gray-900 dark:text-white",
    container: "flex items-center gap-1.5 min-w-0",
    active: "bg-gray-100 dark:bg-gray-900",
    inactive: "",
    selected: "pe-7",
    disabled: "cursor-not-allowed opacity-50",
    empty: "text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5",
    icon: {
      base: "flex-shrink-0 h-5 w-5",
      active: "text-gray-900 dark:text-white",
      inactive: "text-gray-400 dark:text-gray-500"
    },
    selectedIcon: {
      wrapper: "absolute inset-y-0 end-0 flex items-center",
      padding: "pe-2",
      base: "h-5 w-5 text-gray-900 dark:text-white flex-shrink-0"
    },
    avatar: {
      base: "flex-shrink-0",
      size: "2xs"
    },
    chip: {
      base: "flex-shrink-0 w-2 h-2 mx-1 rounded-full"
    }
  },
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
  transition: {
    leaveActiveClass: "transition ease-in duration-100",
    leaveFromClass: "opacity-100",
    leaveToClass: "opacity-0"
  },
  popper: {
    placement: "bottom-end"
  },
  default: {
    selectedIcon: "i-heroicons-check-20-solid",
    trailingIcon: "i-heroicons-chevron-down-20-solid"
  },
  arrow: {
    ...arrow,
    ring: "before:ring-1 before:ring-gray-200 dark:before:ring-gray-700",
    background: "before:bg-white dark:before:bg-gray-700"
  }
};
({
  ...input,
  form: "form-textarea",
  default: {
    size: "sm",
    color: "white",
    variant: "outline"
  }
});
({
  ...input,
  form: "form-select",
  placeholder: "text-gray-400 dark:text-gray-500",
  default: {
    size: "sm",
    color: "white",
    variant: "outline",
    loadingIcon: "i-heroicons-arrow-path-20-solid",
    trailingIcon: "i-heroicons-chevron-down-20-solid"
  }
});
({
  ...inputMenu,
  select: "inline-flex items-center text-left cursor-default",
  input: "block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-0 border-b border-gray-200 dark:border-gray-700 sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none",
  required: "absolute inset-0 w-px opacity-0 cursor-default",
  label: "block truncate",
  option: {
    ...inputMenu.option,
    create: "block truncate"
  },
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
  transition: {
    leaveActiveClass: "transition ease-in duration-100",
    leaveFromClass: "opacity-100",
    leaveToClass: "opacity-0"
  },
  popper: {
    placement: "bottom-end"
  },
  default: {
    selectedIcon: "i-heroicons-check-20-solid",
    clearSearchOnClose: false,
    showCreateOptionWhen: "empty"
  },
  arrow: {
    ...arrow,
    ring: "before:ring-1 before:ring-gray-200 dark:before:ring-gray-700",
    background: "before:bg-white dark:before:bg-gray-700"
  }
});
const notification = {
  wrapper: "w-full pointer-events-auto",
  container: "relative overflow-hidden",
  inner: "w-0 flex-1",
  title: "text-sm font-medium text-gray-900 dark:text-white",
  description: "mt-1 text-sm leading-4 text-gray-500 dark:text-gray-400",
  actions: "flex items-center gap-2 mt-3 flex-shrink-0",
  background: "bg-white dark:bg-gray-900",
  shadow: "shadow-lg",
  rounded: "rounded-lg",
  padding: "p-4",
  gap: "gap-3",
  ring: "ring-1 ring-gray-200 dark:ring-gray-800",
  icon: {
    base: "flex-shrink-0 w-5 h-5",
    color: "text-{color}-500 dark:text-{color}-400"
  },
  avatar: {
    base: "flex-shrink-0 self-center",
    size: "md"
  },
  progress: {
    base: "absolute bottom-0 end-0 start-0 h-1",
    background: "bg-{color}-500 dark:bg-{color}-400"
  },
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
  transition: {
    enterActiveClass: "transform ease-out duration-300 transition",
    enterFromClass: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2",
    enterToClass: "translate-y-0 opacity-100 sm:translate-x-0",
    leaveActiveClass: "transition ease-in duration-100",
    leaveFromClass: "opacity-100",
    leaveToClass: "opacity-0"
  },
  default: {
    color: "primary",
    icon: null,
    timeout: 5e3,
    closeButton: {
      icon: "i-heroicons-x-mark-20-solid",
      color: "gray",
      variant: "link",
      padded: false
    },
    actionButton: {
      size: "xs",
      color: "white"
    }
  }
};
const notifications = {
  wrapper: "fixed flex flex-col justify-end z-[55]",
  position: "bottom-0 end-0",
  width: "w-full sm:w-96",
  container: "px-4 sm:px-6 py-6 space-y-3 overflow-y-auto"
};
const config$3 = mergeConfig(appConfig.ui.strategy, appConfig.ui.avatar, avatar);
const _sfc_main$7 = defineComponent({
  components: {
    UIcon: __nuxt_component_2$1
  },
  inheritAttrs: false,
  props: {
    src: {
      type: [String, Boolean],
      default: null
    },
    alt: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: () => config$3.default.icon
    },
    size: {
      type: String,
      default: () => config$3.default.size,
      validator(value) {
        return Object.keys(config$3.size).includes(value);
      }
    },
    chipColor: {
      type: String,
      default: () => config$3.default.chipColor,
      validator(value) {
        return ["gray", ...appConfig.ui.colors].includes(value);
      }
    },
    chipPosition: {
      type: String,
      default: () => config$3.default.chipPosition,
      validator(value) {
        return Object.keys(config$3.chip.position).includes(value);
      }
    },
    chipText: {
      type: [String, Number],
      default: null
    },
    imgClass: {
      type: String,
      default: ""
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI("avatar", toRef(props, "ui"), config$3);
    const url = computed(() => {
      if (typeof props.src === "boolean") {
        return null;
      }
      return props.src;
    });
    const placeholder = computed(() => {
      return (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2);
    });
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        (error.value || !url.value) && ui.value.background,
        ui.value.rounded,
        ui.value.size[props.size]
      ), props.class);
    });
    const imgClass = computed(() => {
      return twMerge(twJoin(
        ui.value.rounded,
        ui.value.size[props.size]
      ), props.imgClass);
    });
    const iconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[props.size]
      );
    });
    const chipClass = computed(() => {
      return twJoin(
        ui.value.chip.base,
        ui.value.chip.size[props.size],
        ui.value.chip.position[props.chipPosition],
        ui.value.chip.background.replaceAll("{color}", props.chipColor)
      );
    });
    const error = ref(false);
    watch(() => props.src, () => {
      if (error.value) {
        error.value = false;
      }
    });
    function onError() {
      error.value = true;
    }
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      imgClass,
      iconClass,
      chipClass,
      url,
      placeholder,
      error,
      onError
    };
  }
});
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UIcon = __nuxt_component_2$1;
  _push(`<span${ssrRenderAttrs(mergeProps({ class: _ctx.wrapperClass }, _attrs))}>`);
  if (_ctx.url && !_ctx.error) {
    _push(`<img${ssrRenderAttrs(mergeProps({
      class: _ctx.imgClass,
      alt: _ctx.alt,
      src: _ctx.url
    }, _ctx.attrs))}>`);
  } else if (_ctx.text) {
    _push(`<span class="${ssrRenderClass(_ctx.ui.text)}">${ssrInterpolate(_ctx.text)}</span>`);
  } else if (_ctx.icon) {
    _push(ssrRenderComponent(_component_UIcon, {
      name: _ctx.icon,
      class: _ctx.iconClass
    }, null, _parent));
  } else if (_ctx.placeholder) {
    _push(`<span class="${ssrRenderClass(_ctx.ui.placeholder)}">${ssrInterpolate(_ctx.placeholder)}</span>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.chipColor) {
    _push(`<span class="${ssrRenderClass(_ctx.chipClass)}">${ssrInterpolate(_ctx.chipText)}</span>`);
  } else {
    _push(`<!---->`);
  }
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</span>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Avatar.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$6 = defineComponent({
  inheritAttrs: false,
  props: {
    ...nuxtLinkProps,
    as: {
      type: String,
      default: "button"
    },
    type: {
      type: String,
      default: "button"
    },
    disabled: {
      type: Boolean,
      default: null
    },
    active: {
      type: Boolean,
      default: void 0
    },
    exact: {
      type: Boolean,
      default: false
    },
    exactQuery: {
      type: Boolean,
      default: false
    },
    exactHash: {
      type: Boolean,
      default: false
    },
    inactiveClass: {
      type: String,
      default: void 0
    }
  },
  setup(props) {
    function resolveLinkClass(route, $route, { isActive, isExactActive }) {
      if (props.exactQuery && !isEqual(route.query, $route.query)) {
        return props.inactiveClass;
      }
      if (props.exactHash && route.hash !== $route.hash) {
        return props.inactiveClass;
      }
      if (props.exact && isExactActive) {
        return props.activeClass;
      }
      if (!props.exact && isActive) {
        return props.activeClass;
      }
      return props.inactiveClass;
    }
    return {
      resolveLinkClass
    };
  }
});
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$4;
  if (!_ctx.to) {
    ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.as), mergeProps({
      type: _ctx.type,
      disabled: _ctx.disabled
    }, _ctx.$attrs, {
      class: _ctx.active ? _ctx.activeClass : _ctx.inactiveClass
    }, _attrs), {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          ssrRenderSlot(_ctx.$slots, "default", { isActive: _ctx.active }, null, _push2, _parent2, _scopeId);
        } else {
          return [
            renderSlot(_ctx.$slots, "default", { isActive: _ctx.active })
          ];
        }
      }),
      _: 3
    }), _parent);
  } else {
    _push(ssrRenderComponent(_component_NuxtLink, mergeProps(_ctx.$props, { custom: "" }, _attrs), {
      default: withCtx(({ route, href, target, rel, navigate, isActive, isExactActive, isExternal }, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<a${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
            href: !_ctx.disabled ? href : void 0,
            "aria-disabled": _ctx.disabled ? "true" : void 0,
            role: _ctx.disabled ? "link" : void 0,
            rel,
            target,
            class: _ctx.active !== void 0 ? _ctx.active ? _ctx.activeClass : _ctx.inactiveClass : _ctx.resolveLinkClass(route, _ctx.$route, { isActive, isExactActive })
          }))}${_scopeId}>`);
          ssrRenderSlot(_ctx.$slots, "default", { isActive: _ctx.active !== void 0 ? _ctx.active : _ctx.exact ? isExactActive : isActive }, null, _push2, _parent2, _scopeId);
          _push2(`</a>`);
        } else {
          return [
            createVNode("a", mergeProps(_ctx.$attrs, {
              href: !_ctx.disabled ? href : void 0,
              "aria-disabled": _ctx.disabled ? "true" : void 0,
              role: _ctx.disabled ? "link" : void 0,
              rel,
              target,
              class: _ctx.active !== void 0 ? _ctx.active ? _ctx.activeClass : _ctx.inactiveClass : _ctx.resolveLinkClass(route, _ctx.$route, { isActive, isExactActive }),
              onClick: (e) => !isExternal && !_ctx.disabled && navigate(e)
            }), [
              renderSlot(_ctx.$slots, "default", { isActive: _ctx.active !== void 0 ? _ctx.active : _ctx.exact ? isExactActive : isActive })
            ], 16, ["href", "aria-disabled", "role", "rel", "target", "onClick"])
          ];
        }
      }),
      _: 3
    }, _parent));
  }
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Link.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$4]]);
function useProvideButtonGroup(buttonGroupProps) {
  const instance = getCurrentInstance();
  const groupKey = `group-${instance.uid}`;
  const state = ref({
    children: [],
    register(child) {
      this.children.push(child);
    },
    unregister(child) {
      const index = this.children.indexOf(child);
      if (index > -1) {
        this.children.splice(index, 1);
      }
    },
    ...buttonGroupProps
  });
  provide(groupKey, state);
}
function useInjectButtonGroup({ ui, props }) {
  const instance = getCurrentInstance();
  let parent = instance.parent;
  let groupContext;
  while (parent && !groupContext) {
    if (parent.type.name === "ButtonGroup") {
      groupContext = inject(`group-${parent.uid}`);
      break;
    }
    parent = parent.parent;
  }
  const positionInGroup = computed(() => groupContext == null ? void 0 : groupContext.value.children.indexOf(instance));
  onUnmounted(() => {
    groupContext == null ? void 0 : groupContext.value.unregister(instance);
  });
  return {
    size: computed(() => (groupContext == null ? void 0 : groupContext.value.size) || props.size),
    rounded: computed(() => {
      if (!groupContext || positionInGroup.value === -1)
        return ui.value.rounded;
      if (groupContext.value.children.length === 1)
        return groupContext.value.ui.rounded;
      if (positionInGroup.value === 0)
        return groupContext.value.rounded.start;
      if (positionInGroup.value === groupContext.value.children.length - 1)
        return groupContext.value.rounded.end;
      return "rounded-none";
    })
  };
}
const config$2 = mergeConfig(appConfig.ui.strategy, appConfig.ui.button, button);
const _sfc_main$5 = defineComponent({
  components: {
    UIcon: __nuxt_component_2$1,
    ULink: __nuxt_component_0$1
  },
  inheritAttrs: false,
  props: {
    ...nuxtLinkProps,
    type: {
      type: String,
      default: "button"
    },
    block: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: () => config$2.default.size,
      validator(value) {
        return Object.keys(config$2.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config$2.default.color,
      validator(value) {
        return [...appConfig.ui.colors, ...Object.keys(config$2.color)].includes(value);
      }
    },
    variant: {
      type: String,
      default: () => config$2.default.variant,
      validator(value) {
        return [
          ...Object.keys(config$2.variant),
          ...Object.values(config$2.color).flatMap((value2) => Object.keys(value2))
        ].includes(value);
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => config$2.default.loadingIcon
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    },
    truncate: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const { ui, attrs } = useUI("button", toRef(props, "ui"), config$2);
    const { size, rounded } = useInjectButtonGroup({ ui, props });
    const isLeading = computed(() => {
      return props.icon && props.leading || props.icon && !props.trailing || props.loading && !props.trailing || props.leadingIcon;
    });
    const isTrailing = computed(() => {
      return props.icon && props.trailing || props.loading && props.trailing || props.trailingIcon;
    });
    const isSquare = computed(() => props.square || !slots.default && !props.label);
    const buttonClass = computed(() => {
      var _a, _b;
      const variant = ((_b = (_a = ui.value.color) == null ? void 0 : _a[props.color]) == null ? void 0 : _b[props.variant]) || ui.value.variant[props.variant];
      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        rounded.value,
        ui.value.size[size.value],
        ui.value.gap[size.value],
        props.padded && ui.value[isSquare.value ? "square" : "padding"][size.value],
        variant == null ? void 0 : variant.replaceAll("{color}", props.color),
        props.block ? ui.value.block : ui.value.inline
      ), props.class);
    });
    const leadingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon;
      }
      return props.leadingIcon || props.icon;
    });
    const trailingIconName = computed(() => {
      if (props.loading && !isLeading.value) {
        return props.loadingIcon;
      }
      return props.trailingIcon || props.icon;
    });
    const leadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && ui.value.icon.loading
      );
    });
    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && ui.value.icon.loading
      );
    });
    const linkProps = computed(() => getNuxtLinkProps(props));
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isLeading,
      isTrailing,
      isSquare,
      buttonClass,
      leadingIconName,
      trailingIconName,
      leadingIconClass,
      trailingIconClass,
      linkProps
    };
  }
});
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ULink = __nuxt_component_0$1;
  const _component_UIcon = __nuxt_component_2$1;
  _push(ssrRenderComponent(_component_ULink, mergeProps({
    type: _ctx.type,
    disabled: _ctx.disabled || _ctx.loading,
    class: _ctx.buttonClass
  }, { ..._ctx.linkProps, ..._ctx.attrs }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "leading", {
          disabled: _ctx.disabled,
          loading: _ctx.loading
        }, () => {
          if (_ctx.isLeading && _ctx.leadingIconName) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: _ctx.leadingIconName,
              class: _ctx.leadingIconClass,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            _push2(`<!---->`);
          }
        }, _push2, _parent2, _scopeId);
        ssrRenderSlot(_ctx.$slots, "default", {}, () => {
          if (_ctx.label) {
            _push2(`<span class="${ssrRenderClass([_ctx.truncate ? _ctx.ui.truncate : ""])}"${_scopeId}>${ssrInterpolate(_ctx.label)}</span>`);
          } else {
            _push2(`<!---->`);
          }
        }, _push2, _parent2, _scopeId);
        ssrRenderSlot(_ctx.$slots, "trailing", {
          disabled: _ctx.disabled,
          loading: _ctx.loading
        }, () => {
          if (_ctx.isTrailing && _ctx.trailingIconName) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: _ctx.trailingIconName,
              class: _ctx.trailingIconClass,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            _push2(`<!---->`);
          }
        }, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "leading", {
            disabled: _ctx.disabled,
            loading: _ctx.loading
          }, () => [
            _ctx.isLeading && _ctx.leadingIconName ? (openBlock(), createBlock(_component_UIcon, {
              key: 0,
              name: _ctx.leadingIconName,
              class: _ctx.leadingIconClass,
              "aria-hidden": "true"
            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
          ]),
          renderSlot(_ctx.$slots, "default", {}, () => [
            _ctx.label ? (openBlock(), createBlock("span", {
              key: 0,
              class: [_ctx.truncate ? _ctx.ui.truncate : ""]
            }, toDisplayString(_ctx.label), 3)) : createCommentVNode("", true)
          ]),
          renderSlot(_ctx.$slots, "trailing", {
            disabled: _ctx.disabled,
            loading: _ctx.loading
          }, () => [
            _ctx.isTrailing && _ctx.trailingIconName ? (openBlock(), createBlock(_component_UIcon, {
              key: 0,
              name: _ctx.trailingIconName,
              class: _ctx.trailingIconClass,
              "aria-hidden": "true"
            }, null, 8, ["name", "class"])) : createCommentVNode("", true)
          ])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/elements/Button.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$3]]);
const config$1 = mergeConfig(appConfig.ui.strategy, appConfig.ui.notification, notification);
const _sfc_main$4 = defineComponent({
  components: {
    UIcon: __nuxt_component_2$1,
    UAvatar: __nuxt_component_1$1,
    UButton: __nuxt_component_1
  },
  inheritAttrs: false,
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: () => config$1.default.icon
    },
    avatar: {
      type: Object,
      default: null
    },
    closeButton: {
      type: Object,
      default: () => config$1.default.closeButton
    },
    timeout: {
      type: Number,
      default: () => config$1.default.timeout
    },
    actions: {
      type: Array,
      default: () => []
    },
    callback: {
      type: Function,
      default: null
    },
    color: {
      type: String,
      default: () => config$1.default.color,
      validator(value) {
        return ["gray", ...appConfig.ui.colors].includes(value);
      }
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { ui, attrs } = useUI("notification", toRef(props, "ui"), config$1);
    const remaining = ref(props.timeout);
    const wrapperClass = computed(() => {
      var _a;
      return twMerge(twJoin(
        ui.value.wrapper,
        (_a = ui.value.background) == null ? void 0 : _a.replaceAll("{color}", props.color),
        ui.value.rounded,
        ui.value.shadow
      ), props.class);
    });
    const progressClass = computed(() => {
      var _a;
      return twJoin(
        ui.value.progress.base,
        (_a = ui.value.progress.background) == null ? void 0 : _a.replaceAll("{color}", props.color)
      );
    });
    const progressStyle = computed(() => {
      const remainingPercent = remaining.value / props.timeout * 100;
      return { width: `${remainingPercent || 0}%` };
    });
    const iconClass = computed(() => {
      var _a;
      return twJoin(
        ui.value.icon.base,
        (_a = ui.value.icon.color) == null ? void 0 : _a.replaceAll("{color}", props.color)
      );
    });
    function onMouseover() {
    }
    function onMouseleave() {
    }
    function onClose() {
      if (props.callback) {
        props.callback();
      }
      emit("close");
    }
    function onAction(action) {
      if (action.click) {
        action.click();
      }
      emit("close");
    }
    onUnmounted(() => {
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      wrapperClass,
      progressClass,
      progressStyle,
      iconClass,
      onMouseover,
      onMouseleave,
      onClose,
      onAction,
      twMerge
    };
  }
});
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UIcon = __nuxt_component_2$1;
  const _component_UAvatar = __nuxt_component_1$1;
  const _component_UButton = __nuxt_component_1;
  _push(`<template><div${ssrRenderAttrs(mergeProps({
    class: _ctx.wrapperClass,
    role: "status"
  }, _ctx.attrs, _attrs))}><div class="${ssrRenderClass([_ctx.ui.container, _ctx.ui.rounded, _ctx.ui.ring])}"><div class="${ssrRenderClass([[_ctx.ui.padding, _ctx.ui.gap, { "items-start": _ctx.description || _ctx.$slots.description, "items-center": !_ctx.description && !_ctx.$slots.description }], "flex"])}">`);
  if (_ctx.icon) {
    _push(ssrRenderComponent(_component_UIcon, {
      name: _ctx.icon,
      class: _ctx.iconClass
    }, null, _parent));
  } else {
    _push(`<!---->`);
  }
  if (_ctx.avatar) {
    _push(ssrRenderComponent(_component_UAvatar, mergeProps({ size: _ctx.ui.avatar.size, ..._ctx.avatar }, {
      class: _ctx.ui.avatar.base
    }), null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="${ssrRenderClass(_ctx.ui.inner)}">`);
  if (_ctx.title || _ctx.$slots.title) {
    _push(`<p class="${ssrRenderClass(_ctx.ui.title)}">`);
    ssrRenderSlot(_ctx.$slots, "title", { title: _ctx.title }, () => {
      _push(`${ssrInterpolate(_ctx.title)}`);
    }, _push, _parent);
    _push(`</p>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.description || _ctx.$slots.description) {
    _push(`<p class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.description, !(_ctx.title && _ctx.$slots.title) && "mt-0 leading-5"))}">`);
    ssrRenderSlot(_ctx.$slots, "description", { description: _ctx.description }, () => {
      _push(`${ssrInterpolate(_ctx.description)}`);
    }, _push, _parent);
    _push(`</p>`);
  } else {
    _push(`<!---->`);
  }
  if ((_ctx.description || _ctx.$slots.description) && _ctx.actions.length) {
    _push(`<div class="${ssrRenderClass(_ctx.ui.actions)}"><!--[-->`);
    ssrRenderList(_ctx.actions, (action, index) => {
      _push(ssrRenderComponent(_component_UButton, mergeProps({ key: index }, { ..._ctx.ui.default.actionButton || {}, ...action }, {
        onClick: ($event) => _ctx.onAction(action)
      }), null, _parent));
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  if (_ctx.closeButton || !_ctx.description && !_ctx.$slots.description && _ctx.actions.length) {
    _push(`<div class="${ssrRenderClass(_ctx.twMerge(_ctx.ui.actions, "mt-0"))}">`);
    if (!_ctx.description && !_ctx.$slots.description && _ctx.actions.length) {
      _push(`<!--[-->`);
      ssrRenderList(_ctx.actions, (action, index) => {
        _push(ssrRenderComponent(_component_UButton, mergeProps({ key: index }, { ..._ctx.ui.default.actionButton || {}, ...action }, {
          onClick: ($event) => _ctx.onAction(action)
        }), null, _parent));
      });
      _push(`<!--]-->`);
    } else {
      _push(`<!---->`);
    }
    if (_ctx.closeButton) {
      _push(ssrRenderComponent(_component_UButton, mergeProps({ "aria-label": "Close" }, { ..._ctx.ui.default.closeButton || {}, ..._ctx.closeButton }, { onClick: _ctx.onClose }), null, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  if (_ctx.timeout) {
    _push(`<div class="${ssrRenderClass(_ctx.progressClass)}" style="${ssrRenderStyle(_ctx.progressStyle)}"></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></template>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Notification.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$2]]);
function useToast() {
  const notifications2 = useState("notifications", () => []);
  function add(notification2) {
    const body = {
      id: (/* @__PURE__ */ new Date()).getTime().toString(),
      ...notification2
    };
    const index = notifications2.value.findIndex((n) => n.id === body.id);
    if (index === -1) {
      notifications2.value.push(body);
    }
    return body;
  }
  function remove(id) {
    notifications2.value = notifications2.value.filter((n) => n.id !== id);
  }
  return {
    add,
    remove
  };
}
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.notifications, notifications);
const _sfc_main$3 = defineComponent({
  components: {
    UNotification: __nuxt_component_0
  },
  inheritAttrs: false,
  props: {
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI("notifications", toRef(props, "ui"), config);
    const toast = useToast();
    const notifications2 = useState("notifications", () => []);
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.position,
        ui.value.width
      ), props.class);
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      toast,
      notifications: notifications2,
      wrapperClass
    };
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UNotification = __nuxt_component_0;
  ssrRenderTeleport(_push, (_push2) => {
    _push2(`<div${ssrRenderAttrs(mergeProps({
      class: _ctx.wrapperClass,
      role: "region"
    }, _ctx.attrs))}>`);
    if (_ctx.notifications.length) {
      _push2(`<div class="${ssrRenderClass(_ctx.ui.container)}"><!--[-->`);
      ssrRenderList(_ctx.notifications, (notification2) => {
        _push2(`<div>`);
        _push2(ssrRenderComponent(_component_UNotification, mergeProps(notification2, {
          class: notification2.click && "cursor-pointer",
          onClick: ($event) => notification2.click && notification2.click(notification2),
          onClose: ($event) => _ctx.toast.remove(notification2.id)
        }), createSlots({ _: 2 }, [
          renderList(_ctx.$slots, (_, name) => {
            return {
              name,
              fn: withCtx((slotData, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, name, slotData, null, _push3, _parent2, _scopeId);
                } else {
                  return [
                    renderSlot(_ctx.$slots, name, slotData)
                  ];
                }
              })
            };
          })
        ]), _parent));
        _push2(`</div>`);
      });
      _push2(`<!--]--></div>`);
    } else {
      _push2(`<!---->`);
    }
    _push2(`</div>`);
  }, "body", false, _parent);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/overlays/Notifications.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLoadingIndicator = __nuxt_component_0$3;
  const _component_NuxtLayout = __nuxt_component_1$2;
  const _component_UNotifications = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_NuxtLoadingIndicator, null, null, _parent));
  _push(ssrRenderComponent(_component_NuxtLayout, null, null, _parent));
  _push(ssrRenderComponent(_component_UNotifications, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    (_error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-Bk6CsCv2.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./error-500-nsJJ8FQJ.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-DbAZV5lv.mjs').then((r) => r.default || r));
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { generateRouteKey$1 as A, appPageTransition as B, appKeepalive as C, _wrapIf as D, wrapInKeepAlive as E, toArray as F, useState as G, defineStore as H, LayoutMetaSymbol as L, PageRouteSymbol as P, _export_sfc as _, __nuxt_component_0$4 as a, __nuxt_component_1 as b, createError as c, appConfig as d, entry$1 as default, useUI as e, useProvideButtonGroup as f, getSlotsChildren as g, button as h, input as i, __nuxt_component_2$1 as j, useInjectButtonGroup as k, looseToNumber as l, mergeConfig as m, useRoute as n, useToast as o, mapWritableState as p, __nuxt_component_0$1 as q, asyncDataDefaults as r, useNuxtApp as s, useRequestEvent as t, useHead as u, useRuntimeConfig as v, useAppConfig as w, resolveIconName as x, __nuxt_component_1$1 as y, getULinkProps as z };
//# sourceMappingURL=server.mjs.map

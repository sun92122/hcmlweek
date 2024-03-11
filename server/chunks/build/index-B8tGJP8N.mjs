import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useStore } from './index-p1Z-8VrX.mjs';
import { _ as _export_sfc, a as __nuxt_component_0$4, b as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-img-BCBETiyh.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'ipx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import 'pinia-plugin-persistedstate';
import '@iconify/vue/dist/offline';
import '@iconify/vue';

const __default__$1 = defineComponent({
  name: "cartBox",
  props: {
    productName: {
      type: String,
      required: true
    },
    product: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...__default__$1,
  __ssrInlineRender: true,
  setup(__props) {
    const store = useStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_NuxtImg = __nuxt_component_0;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cart-box" }, _attrs))} data-v-3cefbede><div class="product-img" data-v-3cefbede>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/product/${_ctx.productName}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              src: _ctx.product.image ? _ctx.product.image : "https://via.placeholder.com/150",
              alt: "product",
              height: "100px",
              fit: "outside"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtImg, {
                src: _ctx.product.image ? _ctx.product.image : "https://via.placeholder.com/150",
                alt: "product",
                height: "100px",
                fit: "outside"
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="product-container" data-v-3cefbede><div class="product-name" data-v-3cefbede>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/product/${_ctx.productName}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-3cefbede${_scopeId}>${ssrInterpolate(_ctx.productName)}</span>`);
          } else {
            return [
              createVNode("span", null, toDisplayString(_ctx.productName), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="product-info" data-v-3cefbede><div class="product-option" data-v-3cefbede><span data-v-3cefbede></span></div><div class="product-count" data-v-3cefbede><span data-v-3cefbede>\u6578\u91CF</span></div><div class="product-subtotal" data-v-3cefbede><span data-v-3cefbede>\u5C0F\u8A08</span></div></div><!--[-->`);
      ssrRenderList(_ctx.item, (count, option) => {
        _push(`<div class="product-info" data-v-3cefbede>`);
        if (_ctx.product.options[option]) {
          _push(`<div data-v-3cefbede><div class="product-option" data-v-3cefbede><span data-v-3cefbede>${ssrInterpolate(_ctx.product.options[option].name)}</span></div><div class="product-count" data-v-3cefbede><span data-v-3cefbede>${ssrInterpolate(count)}</span></div><div class="product-subtotal" data-v-3cefbede><span data-v-3cefbede>${ssrInterpolate(count * (_ctx.product.options[option].price || _ctx.product.price.min))}</span></div><div class="product-remove" data-v-3cefbede>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "2xs",
            variant: "outline",
            color: "red",
            label: "\u79FB\u9664",
            onClick: () => unref(store).removeFromCart(_ctx.productName, parseInt(option))
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<div data-v-3cefbede><div class="product-option" data-v-3cefbede><span data-v-3cefbede></span></div><div class="product-count" data-v-3cefbede><span data-v-3cefbede>${ssrInterpolate(count)}</span></div><div class="product-subtotal" data-v-3cefbede><span data-v-3cefbede>${ssrInterpolate(count * _ctx.product.price.min)}</span></div><div class="product-remove" data-v-3cefbede>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "2xs",
            variant: "outline",
            color: "red",
            label: "\u79FB\u9664",
            onClick: () => unref(store).removeFromCart(_ctx.productName, -1)
          }, null, _parent));
          _push(`</div></div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cartBox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const cartBox = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3cefbede"]]);
const __default__ = {
  name: "Cart",
  layout: "default",
  data() {
    return {
      cartBox
    };
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __ssrInlineRender: true,
  setup(__props) {
    const store = useStore();
    const products = store.getProducts;
    const cart = store.cart;
    const total = store.getTotal;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-33e8113f><div class="cart-container" data-v-33e8113f>`);
      if (!Object.keys(unref(cart)).length) {
        _push(`<div data-v-33e8113f><h2 data-v-33e8113f>\u8CFC\u7269\u8ECA\u662F\u7A7A\u7684</h2></div>`);
      } else {
        _push(`<div data-v-33e8113f><!--[-->`);
        ssrRenderList(unref(cart), (item, product) => {
          _push(ssrRenderComponent(cartBox, {
            key: product,
            productName: String(product),
            product: unref(products)[product],
            item
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`<div class="cart-total" data-v-33e8113f><span data-v-33e8113f>\u7E3D\u91D1\u984D: ${ssrInterpolate(unref(total))}</span></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-33e8113f"]]);

export { index as default };
//# sourceMappingURL=index-B8tGJP8N.mjs.map

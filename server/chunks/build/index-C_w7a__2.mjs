import { u as useAsyncData } from './asyncData-DwSY4VoB.mjs';
import { defineComponent, useSSRContext, withAsyncContext, unref, withCtx, createTextVNode, toDisplayString, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useStore } from './index-p1Z-8VrX.mjs';
import { _ as __nuxt_component_0 } from './nuxt-img-BCBETiyh.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$1 = defineComponent({
  name: "productBox",
  props: {
    ProductImage: {
      type: String,
      required: false
    },
    ProductName: {
      type: [String, Number],
      required: false
    },
    ProductNoted: {
      type: String,
      required: false
    },
    Price: {
      type: Object,
      required: false
    }
  },
  methods: {
    redirectToProduct() {
      const store = useStore();
      store.goToProduct(`${this.ProductName}`);
      this.$router.push(`/product/${this.ProductName}`);
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtImg = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-box" }, _attrs))} data-v-7d038c4a><div class="product-img" data-v-7d038c4a>`);
  _push(ssrRenderComponent(_component_NuxtImg, {
    src: _ctx.ProductImage ? _ctx.ProductImage : "https://via.placeholder.com/150",
    alt: "product"
  }, null, _parent));
  _push(`</div><div class="product-info" data-v-7d038c4a><div class="product-name" data-v-7d038c4a><span data-v-7d038c4a>${ssrInterpolate(_ctx.ProductName)}</span></div><div class="product-noted" data-v-7d038c4a><span data-v-7d038c4a>${_ctx.ProductNoted}</span></div><div class="product-price" data-v-7d038c4a>`);
  if (_ctx.Price) {
    _push(`<span data-v-7d038c4a><span data-v-7d038c4a>NT $${ssrInterpolate(_ctx.Price.min)}</span>`);
    if (_ctx.Price.max > _ctx.Price.min) {
      _push(`<span data-v-7d038c4a>-</span>`);
    } else {
      _push(`<!---->`);
    }
    if (_ctx.Price.max > _ctx.Price.min) {
      _push(`<span data-v-7d038c4a>NT $${ssrInterpolate(_ctx.Price.max)}</span>`);
    } else {
      _push(`<!---->`);
    }
    if (_ctx.Price.ori) {
      _push(`<del data-v-7d038c4a>NT $${ssrInterpolate(_ctx.Price.ori)}</del>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/productBox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const productBox = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7d038c4a"]]);
const __default__ = {
  name: "Home",
  layout: "default",
  data() {
    return {
      productBox
    };
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const store = useStore();
    let tmpProducts = store.getProducts;
    if (Object.keys(tmpProducts).length === 0) {
      var productsData = {};
      [__temp, __restore] = withAsyncContext(async () => useAsyncData(
        "productsData",
        () => $fetch(store.apiURL).then(async (res) => {
          productsData = await res;
        })
      )), __temp = await __temp, __restore();
      const products = productsData;
      store.products = products;
    } else {
      console.log("no need to fetch");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-438462cb><div class="product-container" data-v-438462cb><div data-v-438462cb><!--[-->`);
      ssrRenderList(unref(tmpProducts), (product, productName) => {
        _push(ssrRenderComponent(productBox, {
          "-product-image": product.image,
          "-product-name": productName,
          "-product-noted": product.noted,
          "-price": product.price,
          key: productName
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(productName)}`);
            } else {
              return [
                createTextVNode(toDisplayString(productName), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-438462cb"]]);

export { index as default };
//# sourceMappingURL=index-C_w7a__2.mjs.map

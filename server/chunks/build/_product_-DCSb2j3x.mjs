import { _ as __nuxt_component_0 } from './nuxt-img-BCBETiyh.mjs';
import { m as mergeConfig, h as button, d as appConfig, e as useUI, g as getSlotsChildren, f as useProvideButtonGroup, i as input, j as __nuxt_component_2$1, k as useInjectButtonGroup, o as useToast, p as mapWritableState, _ as _export_sfc, n as useRoute, l as looseToNumber, b as __nuxt_component_1, q as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, toRef, computed, h, ref, useSSRContext, inject, withAsyncContext, mergeProps, unref, withCtx, isRef, createVNode } from 'vue';
import { twMerge, twJoin } from 'tailwind-merge';
import { n as defu } from '../runtime.mjs';
import { useDebounceFn } from '@vueuse/core';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-DwSY4VoB.mjs';
import { u as useStore } from './index-p1Z-8VrX.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'pinia-plugin-persistedstate';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'ipx';

const buttonGroup = {
  wrapper: {
    horizontal: "inline-flex -space-x-px",
    vertical: "inline-flex flex-col -space-y-px"
  },
  rounded: "rounded-md",
  shadow: "shadow-sm",
  orientation: {
    "rounded-none": { horizontal: { start: "rounded-s-none", end: "rounded-e-none" }, vertical: { start: "rounded-t-none", end: "rounded-b-none" } },
    "rounded-sm": { horizontal: { start: "rounded-s-sm", end: "rounded-e-sm" }, vertical: { start: "rounded-t-sm", end: "rounded-b-sm" } },
    rounded: { horizontal: { start: "rounded-s", end: "rounded-e" }, vertical: { start: "rounded-t", end: "rounded-b" } },
    "rounded-md": { horizontal: { start: "rounded-s-md", end: "rounded-e-md" }, vertical: { start: "rounded-t-md", end: "rounded-b-md" } },
    "rounded-lg": { horizontal: { start: "rounded-s-lg", end: "rounded-e-lg" }, vertical: { start: "rounded-t-lg", end: "rounded-b-lg" } },
    "rounded-xl": { horizontal: { start: "rounded-s-xl", end: "rounded-e-xl" }, vertical: { start: "rounded-t-xl", end: "rounded-b-xl" } },
    "rounded-2xl": { horizontal: { start: "rounded-s-2xl", end: "rounded-e-2xl" }, vertical: { start: "rounded-t-2xl", end: "rounded-b-2xl" } },
    "rounded-3xl": { horizontal: { start: "rounded-s-3xl", end: "rounded-e-3xl" }, vertical: { start: "rounded-t-3xl", end: "rounded-b-3xl" } },
    "rounded-full": { horizontal: { start: "rounded-s-full", end: "rounded-e-full" }, vertical: { start: "rounded-t-full", end: "rounded-b-full" } }
  }
};
const buttonConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.button, button);
const buttonGroupConfig = mergeConfig(appConfig.ui.strategy, appConfig.ui.buttonGroup, buttonGroup);
const __nuxt_component_2 = defineComponent({
  name: "ButtonGroup",
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(buttonConfig.size).includes(value);
      }
    },
    orientation: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
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
  setup(props, { slots }) {
    const { ui, attrs } = useUI("buttonGroup", toRef(props, "ui"), buttonGroupConfig);
    const children = computed(() => getSlotsChildren(slots));
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper[props.orientation],
        ui.value.rounded,
        ui.value.shadow
      ), props.class);
    });
    const rounded = computed(() => ui.value.orientation[ui.value.rounded][props.orientation]);
    useProvideButtonGroup({ orientation: toRef(props, "orientation"), size: toRef(props, "size"), ui, rounded });
    return () => h("div", { class: wrapperClass.value, ...attrs.value }, children.value);
  }
});
const useFormGroup = (inputProps, config2) => {
  const formBus = inject("form-events", void 0);
  const formGroup = inject("form-group", void 0);
  const formInputs = inject("form-inputs", void 0);
  if (formGroup) {
    if (inputProps == null ? void 0 : inputProps.id) {
      formGroup.inputId.value = inputProps == null ? void 0 : inputProps.id;
    }
    if (formInputs) {
      formInputs.value[formGroup.name.value] = formGroup.inputId.value;
    }
  }
  const blurred = ref(false);
  function emitFormEvent(type, path) {
    if (formBus) {
      formBus.emit({ type, path });
    }
  }
  function emitFormBlur() {
    emitFormEvent("blur", formGroup == null ? void 0 : formGroup.name.value);
    blurred.value = true;
  }
  function emitFormChange() {
    emitFormEvent("change", formGroup == null ? void 0 : formGroup.name.value);
  }
  const emitFormInput = useDebounceFn(() => {
    if (blurred.value || (formGroup == null ? void 0 : formGroup.eagerValidation.value)) {
      emitFormEvent("input", formGroup == null ? void 0 : formGroup.name.value);
    }
  }, 300);
  return {
    inputId: computed(() => {
      var _a;
      return (_a = inputProps == null ? void 0 : inputProps.id) != null ? _a : formGroup == null ? void 0 : formGroup.inputId.value;
    }),
    name: computed(() => {
      var _a;
      return (_a = inputProps == null ? void 0 : inputProps.name) != null ? _a : formGroup == null ? void 0 : formGroup.name.value;
    }),
    size: computed(() => {
      var _a2, _b;
      var _a;
      const formGroupSize = config2.size[formGroup == null ? void 0 : formGroup.size.value] ? formGroup == null ? void 0 : formGroup.size.value : null;
      return (_b = (_a2 = inputProps == null ? void 0 : inputProps.size) != null ? _a2 : formGroupSize) != null ? _b : (_a = config2 == null ? void 0 : config2.default) == null ? void 0 : _a.size;
    }),
    color: computed(() => {
      var _a;
      return ((_a = formGroup == null ? void 0 : formGroup.error) == null ? void 0 : _a.value) ? "red" : inputProps == null ? void 0 : inputProps.color;
    }),
    emitFormBlur,
    emitFormInput,
    emitFormChange
  };
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.input, input);
const _sfc_main$1 = defineComponent({
  components: {
    UIcon: __nuxt_component_2$1
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autofocusDelay: {
      type: Number,
      default: 100
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon
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
    loading: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: null,
      validator(value) {
        return Object.keys(config.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value);
      }
    },
    variant: {
      type: String,
      default: () => config.default.variant,
      validator(value) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap((value2) => Object.keys(value2))
        ].includes(value);
      }
    },
    inputClass: {
      type: String,
      default: null
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    },
    modelModifiers: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue", "blur"],
  setup(props, { emit, slots }) {
    const { ui, attrs } = useUI("input", toRef(props, "ui"), config, toRef(props, "class"));
    const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props });
    const { emitFormBlur, emitFormInput, size: sizeFormGroup, color, inputId, name } = useFormGroup(props, config);
    const size = computed(() => sizeButtonGroup.value || sizeFormGroup.value);
    const modelModifiers = ref(defu({}, props.modelModifiers, { trim: false, lazy: false, number: false }));
    const input2 = ref(null);
    const updateInput = (value) => {
      if (modelModifiers.value.trim) {
        value = value.trim();
      }
      if (modelModifiers.value.number || props.type === "number") {
        value = looseToNumber(value);
      }
      emit("update:modelValue", value);
      emitFormInput();
    };
    const onInput = (event) => {
      if (!modelModifiers.value.lazy) {
        updateInput(event.target.value);
      }
    };
    const onChange = (event) => {
      const value = event.target.value;
      if (modelModifiers.value.lazy) {
        updateInput(value);
      }
      if (modelModifiers.value.trim) {
        event.target.value = value.trim();
      }
    };
    const onBlur = (event) => {
      emitFormBlur();
      emit("blur", event);
    };
    const inputClass = computed(() => {
      var _a, _b;
      const variant = ((_b = (_a = ui.value.color) == null ? void 0 : _a[color.value]) == null ? void 0 : _b[props.variant]) || ui.value.variant[props.variant];
      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        rounded.value,
        ui.value.placeholder,
        props.type === "file" && [ui.value.file.base, ui.value.file.padding[size.value]],
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : "p-0",
        variant == null ? void 0 : variant.replaceAll("{color}", color.value),
        (isLeading.value || slots.leading) && ui.value.leading.padding[size.value],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]
      ), props.inputClass);
    });
    const isLeading = computed(() => {
      return props.icon && props.leading || props.icon && !props.trailing || props.loading && !props.trailing || props.leadingIcon;
    });
    const isTrailing = computed(() => {
      return props.icon && props.trailing || props.loading && props.trailing || props.trailingIcon;
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
    const leadingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.leading.wrapper,
        ui.value.icon.leading.pointer,
        ui.value.icon.leading.padding[size.value]
      );
    });
    const leadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        color.value && appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll("{color}", color.value),
        ui.value.icon.size[size.value],
        props.loading && ui.value.icon.loading
      );
    });
    const trailingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.trailing.wrapper,
        ui.value.icon.trailing.pointer,
        ui.value.icon.trailing.padding[size.value]
      );
    });
    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        color.value && appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll("{color}", color.value),
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && ui.value.icon.loading
      );
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      input: input2,
      isLeading,
      isTrailing,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      onInput,
      onChange,
      onBlur
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UIcon = __nuxt_component_2$1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.ui.wrapper
  }, _attrs))}><input${ssrRenderAttrs(mergeProps({
    id: _ctx.inputId,
    ref: "input",
    name: _ctx.name,
    value: _ctx.modelValue,
    type: _ctx.type,
    required: _ctx.required,
    placeholder: _ctx.placeholder,
    disabled: _ctx.disabled,
    class: _ctx.inputClass
  }, _ctx.attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  if (_ctx.isLeading && _ctx.leadingIconName || _ctx.$slots.leading) {
    _push(`<span class="${ssrRenderClass(_ctx.leadingWrapperIconClass)}">`);
    ssrRenderSlot(_ctx.$slots, "leading", {
      disabled: _ctx.disabled,
      loading: _ctx.loading
    }, () => {
      _push(ssrRenderComponent(_component_UIcon, {
        name: _ctx.leadingIconName,
        class: _ctx.leadingIconClass
      }, null, _parent));
    }, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  if (_ctx.isTrailing && _ctx.trailingIconName || _ctx.$slots.trailing) {
    _push(`<span class="${ssrRenderClass(_ctx.trailingWrapperIconClass)}">`);
    ssrRenderSlot(_ctx.$slots, "trailing", {
      disabled: _ctx.disabled,
      loading: _ctx.loading
    }, () => {
      _push(ssrRenderComponent(_component_UIcon, {
        name: _ctx.trailingIconName,
        class: _ctx.trailingIconClass
      }, null, _parent));
    }, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui/dist/runtime/components/forms/Input.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const __default__ = {
  async asyncData() {
    const store = useStore();
    if (Object.keys(store.products).length !== 0) {
      return;
    }
    store.products = await $fetch(store.apiURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => await res.json());
  },
  data() {
    const toast = useToast();
    return {
      toast
    };
  },
  methods: {
    addToCart(name, index, count, optNum) {
      if (count === 0) {
        return;
      }
      if (index === -1 && optNum > 0) {
        this.toast.add({
          title: "\u8ACB\u9078\u64C7\u9078\u9805",
          description: "\u8ACB\u9078\u64C7\u4E00\u500B\u9078\u9805",
          timeout: 2500
        });
        return;
      }
      const store = useStore();
      store.addToCart(name, index, Math.max(0, Math.floor(count)));
      store.resetCartCount();
      this.toast.add({
        title: "\u6210\u529F\u52A0\u5165\u8CFC\u7269\u8ECA",
        description: `${count} \u4EF6 ${name}` + (index >= 0 ? `\uFF08${store.getProducts[name].options[index].name}\uFF09` : ""),
        timeout: 2500
      });
    }
  },
  computed: {
    ...mapWritableState(useStore, ["tmpOptionIndex"]),
    ...mapWritableState(useStore, ["cartCount"])
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "[product]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const buttonStyle = {
      primary: true,
      rounded: false
    };
    const cartCount = ref(1);
    const route = useRoute();
    const productName = String(route.params.product);
    const store = useStore();
    store.resetTmpObjectIndex();
    store.tmpProductName = productName;
    if (Object.keys(store.products).length === 0) {
      var productsData = {};
      [__temp, __restore] = withAsyncContext(async () => useAsyncData(
        "productsData",
        () => $fetch(store.apiURL).then(async (res) => {
          productsData = await res;
        })
      )), __temp = await __temp, __restore();
      store.products = productsData;
    }
    const product = store.getProduct;
    if (!product) {
      const toast = useToast();
      toast.add({
        title: "\u627E\u4E0D\u5230\u5546\u54C1",
        description: "\u627E\u4E0D\u5230\u9019\u500B\u5546\u54C1",
        timeout: 5e3
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      const _component_UButton = __nuxt_component_1;
      const _component_UButtonGroup = __nuxt_component_2;
      const _component_UInput = __nuxt_component_3;
      const _component_ULink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-page-container" }, _attrs))} data-v-ebc5756e>`);
      if (unref(product)) {
        _push(`<div class="product-container" data-v-ebc5756e><div class="product-img" data-v-ebc5756e>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: unref(product).image ? unref(product).image : "https://via.placeholder.com/150",
          alt: unref(productName)
        }, null, _parent));
        _push(`</div><div class="product-info-container" data-v-ebc5756e><div class="product-name-container" data-v-ebc5756e><span data-v-ebc5756e>${ssrInterpolate(unref(productName))}</span></div><div class="product-noted-container" data-v-ebc5756e><span data-v-ebc5756e>${unref(product).noted}</span></div>`);
        if (unref(product).price) {
          _push(`<div class="product-price-container" data-v-ebc5756e>`);
          if (unref(product).price.max !== null) {
            _push(`<span style="${ssrRenderStyle(_ctx.tmpOptionIndex == -1 ? null : { display: "none" })}" data-v-ebc5756e><span data-v-ebc5756e>NT $${ssrInterpolate(unref(product).price.min)}</span>`);
            if (unref(product).price.max > unref(product).price.min) {
              _push(`<span data-v-ebc5756e>-</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(product).price.max > unref(product).price.min) {
              _push(`<span data-v-ebc5756e>NT $${ssrInterpolate(unref(product).price.max)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(product).price.ori) {
              _push(`<del data-v-ebc5756e>${ssrInterpolate(unref(product).price.ori)}</del>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(product).price.max === null) {
            _push(`<span data-v-ebc5756e><span data-v-ebc5756e>NT $${ssrInterpolate(unref(product).price.min)}</span>`);
            if (unref(product).price.ori) {
              _push(`<del data-v-ebc5756e>${ssrInterpolate(unref(product).price.ori)}</del>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(product).price.max !== null && _ctx.tmpOptionIndex >= 0) {
            _push(`<span style="${ssrRenderStyle(_ctx.tmpOptionIndex !== -1 ? null : { display: "none" })}" data-v-ebc5756e><span data-v-ebc5756e>NT $${ssrInterpolate(unref(product).options[_ctx.tmpOptionIndex].price)}</span></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).options.length >= 2) {
          _push(`<div class="product-option-container" data-v-ebc5756e><!--[-->`);
          ssrRenderList(unref(product).options, (option, index) => {
            _push(ssrRenderComponent(_component_UButton, {
              color: _ctx.tmpOptionIndex === index ? "purple" : "gray",
              variant: "outline",
              key: index,
              label: option.name,
              onClick: () => {
                _ctx.tmpOptionIndex = index;
              },
              ui: {
                primary: _ctx.tmpOptionIndex === index,
                secondary: _ctx.tmpOptionIndex !== index,
                rounded: false
              }
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="count-container" data-v-ebc5756e>`);
        _push(ssrRenderComponent(_component_UButtonGroup, {
          orientation: "horizontal",
          size: "md",
          ui: {
            rounded: false
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "gray",
                variant: "solid",
                label: "-",
                onClick: () => {
                  cartCount.value = Math.max(0, Math.floor(unref(cartCount)) - 1);
                },
                ui: buttonStyle
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UInput, {
                color: "gray",
                variant: "outline",
                placeholder: "?",
                type: "number",
                modelValue: unref(cartCount),
                "onUpdate:modelValue": ($event) => isRef(cartCount) ? cartCount.value = $event : null,
                ui: {
                  rounded: false,
                  base: "text-center"
                }
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                color: "gray",
                variant: "solid",
                label: "+",
                onClick: () => {
                  cartCount.value = Math.floor(unref(cartCount)) + 1;
                },
                ui: buttonStyle
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  color: "gray",
                  variant: "solid",
                  label: "-",
                  onClick: () => {
                    cartCount.value = Math.max(0, Math.floor(unref(cartCount)) - 1);
                  },
                  ui: buttonStyle
                }, null, 8, ["onClick"]),
                createVNode(_component_UInput, {
                  color: "gray",
                  variant: "outline",
                  placeholder: "?",
                  type: "number",
                  modelValue: unref(cartCount),
                  "onUpdate:modelValue": ($event) => isRef(cartCount) ? cartCount.value = $event : null,
                  ui: {
                    rounded: false,
                    base: "text-center"
                  }
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UButton, {
                  color: "gray",
                  variant: "solid",
                  label: "+",
                  onClick: () => {
                    cartCount.value = Math.floor(unref(cartCount)) + 1;
                  },
                  ui: buttonStyle
                }, null, 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="add-to-cart-container" data-v-ebc5756e>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "purple",
          size: "md",
          label: "\u52A0\u5165\u8CFC\u7269\u8ECA",
          onClick: ($event) => _ctx.addToCart(
            unref(productName),
            _ctx.tmpOptionIndex,
            unref(cartCount),
            unref(product).options.length
          )
        }, null, _parent));
        _push(`</div></div></div><div class="product-description-container" data-v-ebc5756e>`);
        _push(ssrRenderComponent(_component_ULink, { to: "/" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="back-link" data-v-ebc5756e${_scopeId}>&lt; \u8FD4\u56DE\u9996\u9801</span>`);
            } else {
              return [
                createVNode("span", { class: "back-link" }, "< \u8FD4\u56DE\u9996\u9801")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span data-v-ebc5756e>${unref(product).description ? unref(product).description : ""}</span></div></div>`);
      } else {
        _push(`<div data-v-ebc5756e><h1 class="text-center w-full text-3xl" data-v-ebc5756e>Loading...</h1><div class="product-description-container" data-v-ebc5756e>`);
        _push(ssrRenderComponent(_component_ULink, { to: "/" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="back-link" data-v-ebc5756e${_scopeId}>&lt; \u8FD4\u56DE\u9996\u9801</span>`);
            } else {
              return [
                createVNode("span", { class: "back-link" }, "< \u8FD4\u56DE\u9996\u9801")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product/[product].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _product_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ebc5756e"]]);

export { _product_ as default };
//# sourceMappingURL=_product_-DCSb2j3x.mjs.map

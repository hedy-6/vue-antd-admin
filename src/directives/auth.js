import { check } from "../utils/auth";

function install(Vue, option = {}) {
  Vue.directive(option.name || "auth", {
    inserted(el, binding) {
      if (!check(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  });
}

export default {
  install
};

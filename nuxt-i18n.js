import en from "~/locales/en.json";
import ar from "~/locales/ar.json";
export default defineI18nConfig(() => {
  return {
    legacy: false,
    messages: {
      en,
      ar,
    },
  };
});

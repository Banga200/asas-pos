export const useAPIFetch = async (request, opts) => {
  const config = useRuntimeConfig();

  return  await $fetch(request, { baseURL: config.public.apiBase, ...opts });
};

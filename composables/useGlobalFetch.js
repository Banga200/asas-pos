export const useGlobalFetch = async (request, opts) => {
    const config = useRuntimeConfig();
  
    return  await useFetch(request, { baseURL: config.public.apiBase, ...opts });
  };
  
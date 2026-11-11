// @ts-nocheck
// Global window extensions for debugging
declare global {
  interface Window {
    __MAIN_LOADED?: boolean;
    __APP_RENDER_COUNT?: number;
    __LANDING_RENDER_COUNT?: number;
    __DATA_SERVICE_COUNT?: number;
    __FETCH_COUNT?: number;
    __QUERY_CLIENT?: any;
    __REACT_ROOT_CREATED?: boolean;
    __REACT_ROOT_INSTANCE?: any;
  }
}

export {};
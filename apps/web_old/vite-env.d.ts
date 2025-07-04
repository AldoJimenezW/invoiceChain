/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
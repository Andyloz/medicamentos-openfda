/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string|undefined // not strictly required, see https://open.fda.gov/apis/authentication/
}

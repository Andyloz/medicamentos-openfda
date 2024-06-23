// noinspection SpellCheckingInspection

export interface NDCEntry {
  product_ndc?: string
  generic_name?: string
  labeler_name?: string
  brand_name?: string
  active_ingredients?: Activeingredient[]
  finished?: boolean
  packaging?: Packaging[]
  listing_expiration_date?: string
  openfda?: Openfda
  marketing_category?: string
  dosage_form?: string
  spl_id?: string
  product_type?: string
  route?: string[]
  marketing_start_date?: string
  product_id?: string
  application_number?: string
  brand_name_base?: null | string
  pharm_class?: string[]
  dea_schedule?: string
  brand_name_suffix?: string
  marketing_end_date?: string
}

export interface NDCEntrySearchFields {
  product_ndc?: string
  generic_name?: string
  labeler_name?: string
  brand_name?: string
  finished?: string
  listing_expiration_date?: string
  marketing_category?: string
  dosage_form?: string
  spl_id?: string
  product_type?: string
  route?: string
  marketing_start_date?: string
  product_id?: string
  application_number?: string
  brand_name_base?: string
  pharm_class?: string
  dea_schedule?: string
  brand_name_suffix?: string
  marketing_end_date?: string
}

export interface Openfda {
  manufacturer_name?: string[]
  rxcui?: string[]
  spl_set_id?: string[]
  is_original_packager?: boolean[]
  nui?: string[]
  pharm_class_epc?: string[]
  pharm_class_moa?: string[]
  unii?: string[]
  upc?: string[]
  pharm_class_pe?: string[]
  pharm_class_cs?: string[]
}

export interface Packaging {
  package_ndc?: string
  description?: string
  marketing_start_date?: string
  marketing_end_date?: string
  sample?: boolean
}

export interface Activeingredient {
  name?: string
  strength?: string
}
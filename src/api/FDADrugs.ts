// noinspection SpellCheckingInspection

export interface FDAApplication {
  submissions?: Submission[]
  application_number: string
  sponsor_name: string
  products: Product[] // assumed present in this app
  openfda?: Openfda
}

export interface Openfda {
  application_number?: string[]
  brand_name?: string[]
  generic_name?: string[]
  manufacturer_name?: string[]
  product_ndc?: string[]
  product_type?: string[]
  route?: string[]
  substance_name?: string[]
  rxcui?: string[]
  spl_id?: string[]
  spl_set_id?: string[]
  package_ndc?: string[]
  nui?: string[]
  pharm_class_pe?: string[]
  pharm_class_epc?: string[]
  pharm_class_cs?: string[]
  unii?: string[]
  pharm_class_moa?: string[]
}

export interface Product {
  product_number: string
  reference_drug?: string
  brand_name: string
  active_ingredients: ActiveIngredient[]
  reference_standard?: string
  dosage_form: string
  route: null | string
  marketing_status: string
  te_code?: string
}

export interface ActiveIngredient {
  name: string
  strength?: string
}

export interface Submission {
  submission_type: string
  submission_number: string
  submission_status?: string
  submission_status_date?: string
  review_priority?: string
  submission_class_code?: string
  submission_class_code_description?: string
  application_docs?: ApplicationDoc[]
  submission_property_type?: SubmissionPropertyType[]
  submission_public_notes?: string
}

export interface ApplicationDoc {
  id: string
  url: string
  date: string
  type: string
  title?: string
}

export interface SubmissionPropertyType {
  code: string
}

export interface FDAError {
  error: {
    code: string
    message: string
  }
}

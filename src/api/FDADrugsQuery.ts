import { FdaDrugEntry, FDAError } from './FDADrugs.ts'

const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'
const QUERY_LIMIT = 50

/*
* Used for ease a bit the building of queries
* */
export default class FDADrugsQuery {
  readonly params: URLSearchParams

  private constructor() {
    this.params = new URLSearchParams()
    if (import.meta.env.VITE_API_KEY) {
      this.params.set('api_key', import.meta.env.VITE_API_KEY)
    }
    this.params.append('limit', `${QUERY_LIMIT}`)
  }

  static search(search: string) {
    const query = new FDADrugsQuery()
    const queryString =
      `products.brand_name:(${search.split(' ').join(' AND ')}) ` +
      `products.active_ingredients.name:(${search.split(' ').join(' AND ')})`
    query.params.append('search', queryString)
    return query.request()
  }

  toString() {
    return `${DRUGS_URL}?${this.params.toString()}`
  }

  async request() {
    const req = await fetch(this.toString())
    const res = await req.json()

    if ('results' in res) {
      return res.results as FdaDrugEntry[]
    } else {
      return res as FDAError
    }
  }
}

import { FdaDrugEntry, FDAError } from './FDADrugs.ts'

const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'
const QUERY_LIMIT = 50

/**
 * Used for ease a bit the building of queries
 * @see https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm Original searcher
 * */
export default class FDADrugsQuery {
  readonly params: URLSearchParams

  /**
   * Makes sure that the {@link https://open.fda.gov/apis/authentication/ authentication} and the
   * {@link https://open.fda.gov/apis/query-parameters/ query limit} are set
   * */
  private constructor() {
    this.params = new URLSearchParams()
    if (import.meta.env.VITE_API_KEY) {
      this.params.set('api_key', import.meta.env.VITE_API_KEY)
    }
    this.params.append('limit', `${QUERY_LIMIT}`)
  }

  /**
   * See {@link https://open.fda.gov/apis/query-syntax/ query syntax} and
   * {@link https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=faq.page#howsearch explanation of how the
   * search works}
   * */
  static async search(search: string) {
    const query = new FDADrugsQuery()
    // todo allow for code search
    const searchWords = search.split(' ')

    // search brand_name or active_ingredients, both including all words
    const queryString =
      `products.brand_name:(${searchWords.join(' AND ')}) ` +
      `products.active_ingredients.name:(${searchWords.join(' AND ')})`
    query.params.set('search', queryString)

    const results = await query.request()
    if ('error' in results) return results

    // having all brand_names, include in the search all drugs with the same brand_name
    const brandNames = new Set()
    for (const entry of results) {
      for (const product of entry.products || []) {
        brandNames.add(product.brand_name)
      }
    }
    const queryStringIncludingRelated = queryString +
      ` products.brand_name:(${[...brandNames.values()].map(bn => `"${bn}"`).join(' OR ')})`
    query.params.set('search', queryStringIncludingRelated)
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

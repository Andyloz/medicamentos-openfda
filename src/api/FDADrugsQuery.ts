import { FDAApplication, FDAError } from './FDADrugs.ts'

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
   * Grouping the applications by brand_name is not possible due to limitations in the API: 'sorting allowed by
   * non-analyzed fields only'.
   * */
  static async search(search: string) {
    const query = new FDADrugsQuery()
    // todo allow for code search
    const searchWords = search.split(' ').map(encodeURIComponent)

    // search brand_name or active_ingredients, both including all words
    const queryString =
      `products.brand_name:(${searchWords.join(' AND ')}) ` +
      `products.active_ingredients.name:(${searchWords.join(' AND ')})`
    query.params.set('search', queryString)

    const results = await query.request()
    if ('error' in results) {
      return {
        status: 'error' as const,
        ...results
      }
    }

    return {
      status: 'ok' as const,
      drugs: results
    }
  }

  toString() {
    return `${DRUGS_URL}?${this.params.toString()}`
  }

  async request() {
    let res

    try {
      const req = await fetch(this.toString())
      res = await req.json()
    } catch (e) {
      return {
        error: {
          code: 'CUSTOM',
          message: `No se ha podido conectar con el servidor (${(e as TypeError).message ?? undefined})`
        }
      } satisfies FDAError
    }

    if ('results' in res) {
      return res.results as FDAApplication[]
    } else {
      return res as FDAError
    }
  }

}

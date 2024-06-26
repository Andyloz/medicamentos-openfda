import { FDADrugsResponse, FDAErrorResponse } from './FDADrugs.ts'
import invariant from 'tiny-invariant'

export const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'
export const QUERY_LIMIT = 50

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
   * Grouping the applications by brand_name is not possible due to limitations in the API, so it's not possible to
   * fully mimic the original searcher.
   * It's funny to see how this method became a monster until I realized what I've said.
   * @param search Text to be search into applications `products.brand_name` and `products.active_ingredients.name`
   * @param [page=1] Allows for pagination. Starts at 1.
   * */
  static async search(search: string, page: number = 1) {
    // TODO allow for code search
    const query = new FDADrugsQuery()
    const searchWords = search.split(' ').map(encodeURIComponent)

    // search brand_name or active_ingredients, both including all words
    const queryString =
      `products.brand_name:(${searchWords.join(' AND ')}) ` +
      `products.active_ingredients.name:(${searchWords.join(' AND ')})`
    query.params.set('search', queryString)

    // paging
    invariant(page > 0, `Pages starts at 1. Provided: ${page}`)
    query.params.set('skip', `${(page - 1) * QUERY_LIMIT}`)

    const result = await query.request()
    if (result.status === 'error') return result

    return {
      ...result,
      // pagination
      pagination: {
        totalPages: Math.ceil(result.meta.results.total / result.meta.results.limit),
        currentPage: Math.ceil((result.meta.results.skip + 1) / result.meta.results.limit)
      }
    }
  }

  toString() {
    return `${DRUGS_URL}?${this.params.toString()}`
  }

  async request() {
    let res

    try {
      const req = await fetch(this.toString())
      res = await req.json() as FDADrugsResponse | FDAErrorResponse
    } catch (e) {
      return {
        status: 'error' as const,
        error: {
          code: 'CUSTOM',
          message: `No se ha podido conectar con el servidor${e instanceof TypeError && ` (${e.message})`}`
        }
      } satisfies FDAErrorResponse & { status: string }
    }

    if ('results' in res) {
      return {
        status: 'ok' as const,
        ...res
      }
    } else {
      return {
        status: 'error' as const,
        ...res
      }
    }
  }

}

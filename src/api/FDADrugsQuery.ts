import { FdaDrugEntry, FDAError } from './FDADrugs.ts'

const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'
const QUERY_LIMIT = 50

export type FDADrugsQueryResult = Awaited<ReturnType<typeof FDADrugsQuery.search>>

export type FDAGroupedEntries = { [brandName: string]: FdaDrugEntry[] }

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

    const firstResults = await query.request()
    if ('error' in firstResults) {
      return {
        status: 'error' as const,
        ...firstResults
      }
    }

    // having all brand_names, include in the search all drugs with the same brand_name
    const brandNames = new Set<string>()
    for (const entry of firstResults) {
      for (const { brand_name } of entry.products || []) {
        brandNames.add(brand_name)
      }
    }
    const queryStringIncludingRelated = queryString +
      ` products.brand_name:(${[...brandNames.values()].map(bn => `"${bn}"`).join(' OR ')})`
        .replace(';', '') // todo figure why ';' gives bad request
    console.log(queryStringIncludingRelated)
    query.params.set('search', queryStringIncludingRelated)
    const completeResults = await query.request()
    if ('error' in completeResults) {
      return {
        status: 'error' as const,
        ...completeResults
      }
    }

    // group every occurrence by its products brand names
    const groupedResults: FDAGroupedEntries = {}
    for (const brandName of brandNames.values()) {
      groupedResults[brandName] = [] // init
    }
    /**
     * Some applications (entries in the jargon of this app) **could include products with different brand names** as
     * the ones matching in the first search. These are not included as new keys at `groupedResults` nor shown in the
     * search results (case found at ANDA076447).
     * For the same reason, the same application **could be included into multiple groups** if it has products with
     * similar brand names that fits together within the first search criteria (case found searching
     * 'BUTALBITAL ACETAMINOPHEN CAFFEINE CODEINE', ANDA076528).
     * */
    for (const entry of completeResults) {
      let products = entry.products ?? undefined
      if (typeof products === 'undefined') {
        continue
      }

      let entryBrandNames = products.map(prod => prod.brand_name)
      entryBrandNames = [...new Set(entryBrandNames)] // remove duplicates
      const filteredBrandNames = entryBrandNames.filter(bn => brandNames.has(bn)) // filter out-of-search brand names

      for (const brandName of filteredBrandNames) {
        groupedResults[brandName].push(entry)
      }
    }

    return {
      status: 'ok' as const,
      drugs: groupedResults
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
      return res.results as FdaDrugEntry[]
    } else {
      return res as FDAError
    }
  }

}

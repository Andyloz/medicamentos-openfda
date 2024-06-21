const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'

/*
* Used for ease a bit the building of queries
* */
export default class FDADrugsQuery {
  readonly params: URLSearchParams

  constructor(params = new URLSearchParams()) {
    this.params = params
    if (import.meta.env.API_KEY) {
      this.params.set('api_key', import.meta.env.API_KEY)
    }
  }

  /**
   * Allows to append multiple field searches.
   * */
  appendSearch(search: Record<string, string>): void
  /**
   * Appends a single field search.
   * */
  appendSearch(search: string, value: string): void
  appendSearch(search: string|Record<string, string>, value?: string) {
    const newParams = new URLSearchParams(this.params.toString())
    if (typeof search === 'string') {
      newParams.append('search', `${search}:${value}`)
    } else {
      Object.entries(search).forEach(
        ([key, value]) => newParams.append('search', `${key}:${value}`)
      )
    }
    return new FDADrugsQuery(newParams)
  }

  limit(n: number = 1) {
    const newParams = new URLSearchParams(this.params.toString())
    newParams.set('limit', `${n}`)
    return new FDADrugsQuery(newParams)
  }

  toString() {
    return `${DRUGS_URL}?${this.params.toString()}`
  }
}

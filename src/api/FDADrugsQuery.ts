import { FdaDrugEntry, FDAError } from './FDADrugs.ts'

const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'

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
  }

  static search(search: string) {
    const query = new FDADrugsQuery()
    query.params.append('search', `"${search}"`)
    query.params.append('limit', '100')
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

import { FdaDrugEntry } from './FDADrugs.ts'

const DRUGS_URL = 'https://api.fda.gov/drug/drugsfda.json'

/*
* Used for ease a bit the building of queries
* */
export default class FDADrugsQuery {
  readonly params: URLSearchParams

  private constructor() {
    this.params = new URLSearchParams()
    if (import.meta.env.API_KEY) {
      this.params.set('api_key', import.meta.env.API_KEY)
    }
  }

  static search(search: string) {
    const query = new FDADrugsQuery()
    query.params.append('search', search)
    return query.request()
  }

  toString() {
    return `${DRUGS_URL}?${this.params.toString()}`
  }

  async request() {
    const req = await fetch(this.toString())
    const res = await req.json()
    return res.results as FdaDrugEntry[]
  }
}

import FDADrugsQuery from './api/FDADrugsQuery.ts'
import { LoaderFunction } from 'react-router-dom'
import { FdaDrugEntry } from './api/FDADrugs.ts'
import invariant from 'tiny-invariant'

export const indexLoader = (async ({ request }) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  if (typeof q === 'object' || q.length < 3) return null

  console.log('searching')
  const results = await FDADrugsQuery.search(q)

  if ('error' in results && 'code' in results.error) {
    return {
      error: results.error.code === 'NOT_FOUND'
        ? 'No se encontraron medicamentos que coincidan'
        : results.error.message
    }
  }
  invariant(results.error?.message ?? true)
  return { drugs: Object.entries<[string, FdaDrugEntry[]]>(results) }
}) satisfies LoaderFunction

export type IndexLoader = Awaited<ReturnType<typeof indexLoader>>
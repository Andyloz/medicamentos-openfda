import FDADrugsQuery from './api/FDADrugsQuery.ts'
import { LoaderFunction } from 'react-router-dom'

export const indexLoader = (async ({ request }) => {

  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (typeof q === 'object' || q.length < 3) {
    return { status: 'no-search' as const }
  }

  const results = await FDADrugsQuery.search(q)

  if (results.status === 'error') {
    return {
      status: 'error' as const,
      message: results.error.code === 'NOT_FOUND'
        ? 'No se encontraron medicamentos que coincidan'
        : results.error.message
    }
  }
  return {
    status: 'ok' as const,
    drugs: results
  }

}) satisfies LoaderFunction

export type IndexLoader = Awaited<ReturnType<typeof indexLoader>>
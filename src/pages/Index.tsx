import { Box, Card, CardContent, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import FDADrugsQuery, { FDADrugsQueryResult } from '../api/FDADrugsQuery.ts'
import useAsyncEffect from 'use-async-effect'
import Grid from '@mui/material/Unstable_Grid2'
import hashIt from 'hash-it'

export type DrugSearchEntries = ReturnType<typeof Object.entries<FDADrugsQueryResult>>

function Index() {
  // todo move search state to the url
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)

  const [drugEntries, setDrugEntries] = useState<DrugSearchEntries>([])

  if (search.length < 3 && drugEntries.length !== 0) {
    setDrugEntries([])
  }

  const [error, setError] = useState<string>()
  // @ts-ignore todo loading animation
  const [loading, setLoading] = useState(false)

  useAsyncEffect(async (isMounted) => {
    if (debouncedSearch.length < 3) {
      return
    }
    setLoading(true)
    const results = await FDADrugsQuery.search(debouncedSearch)
    if (!isMounted()) {
      return
    }

    if ('error' in results && 'code' in results.error) {
      setDrugEntries([])
      if (results.error.code === 'NOT_FOUND') {
        setError('No se encontraron medicamentos que coincidan')
      } else {
        setError(results.error.message)
      }
    } else {
      setError(undefined)
      setDrugEntries(Object.entries(results))
    }
    setLoading(false)
  }, [debouncedSearch])


  return (
    <Container maxWidth='sm'>
      <h1>Medicamentos FDA</h1>
      <Box sx={{ my: 4 }}>

        {/* search bar */}
        <TextField
          label='Escribe para buscar...'
          variant='outlined'
          sx={{ width: '100%', mb: 2 }}
          value={search} onChange={(e) => setSearch(e.target.value)}
        />

        {/* results count */}
        {drugEntries.length > 0 &&
          <Typography
            variant='body2'
            sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}
          >
            Se han encontrado {drugEntries.length} resultados
          </Typography>
        }

        {/* results display */}
        {error !== undefined &&
          <Typography
            variant='body2'
            sx={{ textAlign: 'center', color: 'text.secondary' }}
            children={error}
          />
        }
        {error === undefined &&
          <Grid container spacing={2}>
            {drugEntries.map(drug =>
              <Grid key={hashIt(drug)} xs={12}>
                <Card variant='outlined'>
                  <CardContent>
                    <pre style={{ fontSize: '.5rem' }}>
                      {JSON.stringify(drug, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        }

      </Box>
    </Container>
  )
}

export default Index

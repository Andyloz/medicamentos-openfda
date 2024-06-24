import { Box, Card, CardContent, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import FDADrugsQuery from './api/FDADrugsQuery.ts'
import useAsyncEffect from 'use-async-effect'
import Grid from '@mui/material/Unstable_Grid2'
import hashIt from 'hash-it'
import { FdaDrugEntry } from './api/FDADrugs.ts'

function App() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)

  const [drugs, setDrugs] = useState<FdaDrugEntry[]>([])

  if (search === '' && drugs.length !== 0) {
    setDrugs([])
  }

  const [error, setError] = useState<string>()

  useAsyncEffect(async (isMounted) => {
    if (debouncedSearch === '') {
      return
    }
    const results = await FDADrugsQuery.search(debouncedSearch)
    if (!isMounted()) {
      return
    }

    if ('error' in results) {
      if (results.error.code === 'NOT_FOUND') {
        setDrugs([])
        setError('No se encontraron medicamentos que coincidan')
      } else {
        setError(results.error.message)
      }
    } else {
      setError(undefined)
      setDrugs(results)
    }
  }, [debouncedSearch])


  return (
    <Container maxWidth='sm'>
      <h1>Medicamentos FDA</h1>
      <Box sx={{ my: 4 }}>
        <TextField
          label='Escribe para buscar...'
          variant='outlined'
          sx={{ width: '100%', mb: 4 }}
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        {error !== undefined &&
          <Typography
            variant='body2'
            sx={{ textAlign: 'center', color: 'text.secondary' }}
            children={error}
          />
        }
        {error === undefined &&
          <Grid container spacing={2}>
            {drugs.map(drug =>
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

export default App

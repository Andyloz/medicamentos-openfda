import { Box, Card, CardContent, Container, TextField } from '@mui/material'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import FDADrugsQuery from './api/FDADrugsQuery.ts'
import useAsyncEffect from 'use-async-effect'
import { NDCEntry } from './api/NDC.ts'
import Grid from '@mui/material/Unstable_Grid2'
import hashIt from 'hash-it'

function App() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 1000)

  const [drugs, setDrugs] = useState<NDCEntry[]>([])

  useAsyncEffect(async (isMounted) => {
    if (debouncedSearch === '') return
    const results = await new FDADrugsQuery()
      .withSearch(debouncedSearch)
      .withLimit(5)
      .request()
    if (!isMounted()) return
    setDrugs(results)
  }, [debouncedSearch])


  return (
    <Container maxWidth='sm'>
      <h1>Medicamentos FDA</h1>
      <Box sx={{ my: 4 }}>
        <TextField
          label='Escribe para buscar...' variant='outlined' sx={{ width: '100%' }}
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <Grid container spacing={2} sx={{ mt: 4 }}>
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
      </Box>
    </Container>
  )
}

export default App

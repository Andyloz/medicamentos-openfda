import { Box, Container, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import hashIt from 'hash-it'
import { Form, useLoaderData, useSubmit } from 'react-router-dom'
import { IndexLoader } from '../loaders.ts'
import { useDebouncedCallback } from 'use-debounce'
import { ChangeEvent } from 'react'

function Index() {

  const data = useLoaderData() as IndexLoader
  const submit = useSubmit()

  const changeHandler = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      submit(e.target.form)
    },
    300
  )

  return (
    <Container maxWidth='sm'>
      <h1>Medicamentos FDA</h1>
      <Box sx={{ my: 4 }}>

        {/* search bar */}
        <Form
          id='search-form' role='search'
          onChange={(e) => changeHandler(e as unknown as ChangeEvent<HTMLInputElement>)}
          onSubmit={(e) => e.preventDefault() /* prevents Enter key from submitting */}
        >
          <TextField
            label='Escribe para buscar...'
            variant='outlined'
            sx={{ width: '100%', mb: 2 }}
            //
            id='q'
            aria-label='Buscar medicamentos'
            type='search'
            name='q'
          />
        </Form>

        {/* results count */}
        {'drugs' in data &&
          <Typography
            variant='body2'
            sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}
          >
            Se han encontrado {data.drugs.length} resultados
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

import { Box, Container, Pagination, TextField, Typography } from '@mui/material'
import { Form, useLoaderData, useSearchParams, useSubmit } from 'react-router-dom'
import { IndexLoader } from '../loaders.ts'
import { useDebouncedCallback } from 'use-debounce'
import { ChangeEvent } from 'react'
import DrugsList from '../components/DrugsList.tsx'

function Index() {

  const data = useLoaderData() as IndexLoader
  const submit = useSubmit()
  const [searchParams, setSearchParams] = useSearchParams()

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
            defaultValue={searchParams.get('q')}
          />
        </Form>

        {/* message */}
        <Typography
          variant='body2'
          sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}
        >
          {data.status === 'ok' && <>Se han encontrado {data.meta.results.total} resultados</>}
          {data.status === 'error' && <>{data.message}</>}
        </Typography>

        {/* results display */}
        {data.status === 'ok' && <DrugsList applications={data.results} />}

        {/* pagination */}
        {data.status === 'ok' &&
          <Box sx={{ display: 'flex' }}>
            <Pagination
              variant='outlined'
              color='primary'
              sx={{ mt: 4, mx: 'auto' }}
              count={data.pagination.totalPages}
              page={data.pagination.currentPage}
              onChange={(_, page) => {
                setSearchParams((prev) => {
                  prev.set('page', `${page}`)
                  return prev
                })
              }}
            />
          </Box>
        }

      </Box>
    </Container>
  )

}

export default Index

import Grid from '@mui/material/Unstable_Grid2'
import { FDAApplication } from '../../api/FDADrugs.ts'
import ProductCard from './ProductCard.tsx'

export interface DrugsListProps {
  applications: FDAApplication[]
}

export default function DrugsList({ applications }: DrugsListProps) {
  return (
    <Grid container spacing={2}>
      {applications.map(application =>
        application.products.map(product =>
          <ProductCard application={application} product={product} />
        )
      )}
    </Grid>
  )
}

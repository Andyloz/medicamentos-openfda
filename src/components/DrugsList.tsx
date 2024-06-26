import Grid from '@mui/material/Unstable_Grid2'
import { Card, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, styled, Typography } from '@mui/material'
import { useState } from 'react'
import { FDAApplication, Product } from '../api/FDADrugs.ts'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { grey } from '@mui/material/colors'

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

/**
 * ProductCard
 * */

interface ProductCardProps {
  application: FDAApplication
  product: Product
}

function ProductCard({ application, product }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Grid xs={12}>
      <Card variant='outlined'>
        <CardHeader
          sx={{
            backgroundColor: grey[50], marginBottom: '-1px',
            borderColor: 'divider', borderWidth: '0 0 1px 0', borderStyle: 'solid'
          }}
          title={
            <>
              <Typography sx={{ fontWeight: 'bold' }}>
                {product.brand_name}
                <Typography
                  children={`#${application.application_number}`}
                  component='span'
                  sx={{ color: 'text.disabled' }}
                />
              </Typography>
            </>
          }
          action={
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
        />
        <Collapse in={expanded} timeout='auto' unmountOnExit sx={{ fontSize: 8 }}>
          <CardContent>
          <pre>
            {JSON.stringify(product, null, 2)}
          </pre>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  )
}

/**
 * ExpandMoreProps
 * */

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

import { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
  Typography
} from '@mui/material'
import { cyan, indigo } from '@mui/material/colors'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FDAApplication, Product } from '../../api/FDADrugs.ts'

export interface ProductCardProps {
  application: FDAApplication
  product: Product
}

export default function ProductCard({ application, product }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Grid xs={12}>
      <Card variant='outlined'>
        <MyCardHeader
          sx={{
            backgroundColor: cyan['A200'], marginBottom: '-1px',
            borderColor: 'divider', borderWidth: '0 0 1px 0', borderStyle: 'solid',
          }}
          title={
            <>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}
              >
                <Typography
                  children={product.brand_name}
                  title={product.brand_name}
                  component='span'
                  sx={{
                    fontWeight: 'bold', color: indigo['500'],
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'
                  }}
                />
                <Typography
                  children={`#${application.application_number}`}
                  component='span'
                />
              </Box>
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

const MyCardHeader = styled(CardHeader)`
  & .MuiCardHeader-content {
    min-width: 0;
  }
`

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

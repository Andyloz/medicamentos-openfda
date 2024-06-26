import {
  CardContent,
  Divider,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { FDAApplication, Product } from '../../api/FDADrugs.ts'
import JoinedElems from '../JoinedElems.tsx'
import { ReactNode } from 'react'

export interface ProductCardContentProps {
  application: FDAApplication
  product: Product
}

export default function ProductCardContent({ application, product }: ProductCardContentProps) {
  return (
    <CardContent>
      <JoinedElems
        separator={<Divider sx={{ mx: -2, my: 1 }} />}
      >
        <ProductProp
          key={'Nombre del patrocinador'}
          title='Nombre del patrocinador'
          value={application.sponsor_name}
        />
        <ProductProp
          key={'Número de producto'}
          title='Número de producto'
          value={product.product_number}
        />
        {typeof product.reference_drug === 'string' &&
          <ProductProp
            key={'Medicamento de referencia'}
            title='Medicamento de referencia'
            value={product.reference_drug}
          />
        }
        <ProductProp
          key={'Nombre de marca'}
          title='Nombre de marca'
          value={product.brand_name}
        />
        {Array.isArray(product.active_ingredients) && product.active_ingredients.length > 0 &&
          <ProductProp
            key={'Ingredientes activos'}
            title='Ingredientes activos'
            value={
              <MyTableContainer sx={{ mb: 2 }}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Fuerza</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.active_ingredients.map(ai => (
                      <TableRow key={`${ai.name}-${ai.strength}`}>
                        <TableCell>{ai.name}</TableCell>
                        <TableCell>{ai.strength}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MyTableContainer>
            }
          />
        }
        {typeof product.reference_standard === 'string' &&
          <ProductProp
            key={'Estándar de referencia'}
            title='Estándar de referencia'
            value={product.reference_standard}
          />
        }
        <ProductProp
          key={'Forma de dosificación'}
          title='Forma de dosificación'
          value={product.dosage_form}
        />
        {typeof product.route === 'string' &&
          <ProductProp
            key={'Ruta'}
            title='Ruta'
            value={product.route}
          />
        }
        <ProductProp
          key={'Estado mercantil'}
          title='Estado mercantil'
          value={product.marketing_status}
        />
        {typeof product.te_code === 'string' &&
          <ProductProp
            key={'Código de equivalencia terapéutica'}
            title='Código de equivalencia terapéutica'
            value={product.te_code}
          />
        }
      </JoinedElems>
    </CardContent>
  )
}

interface ProductPropProps {
  title: string
  value: ReactNode
}

function ProductProp({ title, value }: ProductPropProps) {
  return (
    <>
      <Typography
        variant='h6'
        sx={{ fontSize: 14 }}
        children={title}
      />
      {typeof value === 'string'
        ? <Typography
          paragraph
          sx={{ fontSize: 12 }}
          children={value}
        />
        : value
      }
    </>
  )
}

const MyTableContainer = styled(TableContainer)`
  th {
    font-size: .8rem;
  }

  td {
    font-size: .7rem;
  }

  th, td {
    border: none;
    padding-bottom: 0;
  }
`

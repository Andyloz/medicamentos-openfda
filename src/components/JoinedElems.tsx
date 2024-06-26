import { Fragment, ReactNode } from 'react'

export interface JoinedElemsProps {
  children: ReactNode[],
  separator: ReactNode
}

export default function JoinedElems({ children, separator }: JoinedElemsProps) {
  return children
    .filter(elem => elem !== undefined)
    .map((elem, i) => (
      <Fragment key={i}>
        {i !== 0 && separator}
        {elem}
      </Fragment>
    ))
}

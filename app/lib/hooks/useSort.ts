import { useState } from "react";

export enum Sort {
  Asc = 'asc',
  Desc = 'desc',
}

export function useSort(initialState: Sort = Sort.Asc): [Sort, () => void] {

  const [sort, setSort] = useState(initialState)

  const handleToggle = () => {
    setSort((prev) => prev === Sort.Asc ? Sort.Desc : Sort.Asc);
  }

  return [
    sort,
    handleToggle,
  ]
}

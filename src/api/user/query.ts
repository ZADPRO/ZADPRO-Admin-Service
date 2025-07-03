export const listProductsQuery = `
SELECT
  *
FROM
  public."refProducts"
WHERE
  "isDelete" IS NOT true
  AND "hideStatus" IS NULL
`;


export const getProductQuery  =
`
SELECT
  "refProductsName"
FROM
  public."refProducts"
WHERE
  "refProductsId" = $1
`;
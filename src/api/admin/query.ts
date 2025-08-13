import { executeQuery } from "../../helper/db";

export const selectUserByLogin = `
  SELECT
  ad.*,
  array_agg(DISTINCT rt."refRoleName") AS "refRoleName",
  array_to_json(
    string_to_array(
      trim(
        both '{}'
        from
          ad."refRoleId"
      ),
      ','
    )::int[]
  ) AS "refRoleIdARRINT",
  array_agg(DISTINCT rp."refProductsName") AS "refProductsName",
  array_to_json(
    string_to_array(
      trim(
        both '{}'
        from
          ad."refProductsId"
      ),
      ','
    )::int[]
  ) AS "refProductIdARRINT"
FROM
  public."adminTable" ad
  LEFT JOIN public."refRoleType" rt ON CAST(rt."refRoleId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(ad."refRoleId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refProducts" rp ON CAST(rp."refProductsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(ad."refProductsId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  ad."refUsername" = $1 AND ad."isDelete" IS NOT true
GROUP BY
  ad."adminId";
`;

export const addProductsQuery = `
INSERT INTO
  public."refProducts" (
    "refProductsName",
    "refProductDescription",
    "refProductLink",
    "refProductLogo",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *;
    `;

export const checkQuery = `
SELECT
  *
FROM
  public."adminTable"
WHERE
  "refUsername" = $1
    `;

// export const insertUserQuery = `
// INSERT INTO
//   public."adminTable" (
//     "refRoleId",
//     "refUsername",
//     "refPassword",
//     "refUserHashedpassPassword",
//     "refProductsId",
//     "createdAt",
//     "createdBy"
//   )
// VALUES
//   ($1, $2, $3, $4, $5, $6, $7)
// RETURNING
//   *;
//     `;

export const insertUserQuery = `
  INSERT INTO  public."adminTable" (
    "refRoleId",
    "refUsername",
    "refPassword",
    "refUserHashedpassPassword",
    "refProductsId",
    "userEmail",
     "refName",
    "refDescription",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;
`;

export const checkPasswordQuery = `
SELECT
  *
FROM
  public."adminTable"
WHERE
  "refUsername" = $1
  OR "userEmail" = $2
`;

export const resetPasswordQuery = `
UPDATE
  public."adminTable"
SET
  "refPassword" = $1,
  "refUserHashedpassPassword" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refUsername" = $5
  OR "adminId" = $6
RETURNING
  *;
       `;

export const listProductsQuery = `
SELECT
  *
FROM
  public."refProducts"
WHERE
  "isDelete" IS NOT true
  AND "hideStatus" IS NULL
  AND "refProductsId" != '6'
    `;

export const listRoleTypeQuery = `
SELECT
  *
FROM
  public."refRoleType"
WHERE
   "refRoleId" != '5'
 `;

export const checkProductQuery = `
SELECT
  *
FROM
  public."refProducts"
WHERE
  "refProductsId" = ANY ($1) AND "hideStatus" IS NULL
`;

export const changeVIsibleQuery = `
UPDATE
  public."refProducts"
SET
  "hideStatus" = $1
WHERE
  "refProductsId" = $2
RETURNING
  *;
`;

export const updateAdminQuery = `
UPDATE
  public."adminTable"
SET
  "refProductsId" = array_append("refProductsId"::int[], $1)
WHERE
  "adminId" = $2
`;

export const updateProductQuery = `
UPDATE
  public."refProducts" 
SET
"refProductDescription" = $2,
"refProductLink" = $3,
"refProductLogo"= $4,
"updatedAt"= $5,
"updatedBy"= $6
WHERE
 "refProductsName" = $1
`;

export const ProductsQuery = `
SELECT
  *
FROM
  public."refProducts"
WHERE
  "refProductsId" = $1
`;

export const UpdateUserQuery = `
UPDATE
  public."adminTable" 
SET
"refRoleId"= $2,
"refProductsId" = $3,
"userEmail" = $4,
"refName" = $5,
"refDescription"= $6,
"updatedAt"= $7,
"updatedBy"= $8
WHERE
  "adminId" = $1
`;

export const listAdminQuery = `
SELECT
  ad.*,
  ARRAY_AGG(DISTINCT rp."refProductsName") AS "refProductsName",
  ARRAY_AGG(DISTINCT  r."refRoleName") AS "refRoleName"
FROM
  public."adminTable" ad
LEFT JOIN public."refProducts" rp
  ON CAST(rp."refProductsId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(ad."refProductsId"::text, '[{}]', '', 'g'), ',')::INTEGER[]
  )
LEFT JOIN public."refRoleType" r
  ON CAST(r."refRoleId" AS INTEGER) = ANY (
    string_to_array(regexp_replace(ad."refRoleId"::text, '[{}]', '', 'g'), ',')::INTEGER[]
  )
  WHERE rp."hideStatus" IS NULL 
  AND "adminId" != '1'
  AND ad."isDelete" IS NOT true
GROUP BY ad."adminId"; 
`;

// export const listAdminQuery = `
// SELECT
//   ad.*,
//   ARRAY_AGG(DISTINCT rp."refProductsName") AS "refProductsName",
//   ARRAY_AGG(DISTINCT r."refRoleName") AS "refRoleName",
//   (
//     SELECT
//       ARRAY_AGG(CAST(s AS INTEGER))
//     FROM
//       unnest(
//         string_to_array(
//           regexp_replace(ad."refProductsId"::text, '[{}]', '', 'g'),
//           ','
//         )
//       ) AS s
//     WHERE
//       s ~ '^\d+$'
//   ) AS "refProductsIds",
//   (
//     SELECT
//       ARRAY_AGG(CAST(s AS INTEGER))
//     FROM
//       unnest(
//         string_to_array(
//           regexp_replace(ad."refRoleId"::text, '[{}]', '', 'g'),
//           ','
//         )
//       ) AS s
//     WHERE
//       s ~ '^\d+$'
//   ) AS "refRoleIds"
// FROM
//   public."adminTable" ad
//   LEFT JOIN public."refProducts" rp ON rp."refProductsId" = ANY (
//     COALESCE(
//       (
//         SELECT
//           ARRAY_AGG(CAST(s AS INTEGER))
//         FROM
//           unnest(
//             string_to_array(
//               regexp_replace(ad."refProductsId"::text, '[{}]', '', 'g'),
//               ','
//             )
//           ) AS s
//         WHERE
//           s ~ '^\d+$'
//       ),
//       ARRAY[]::INTEGER[]
//     )
//   )
//   LEFT JOIN public."refRoleType" r ON r."refRoleId" = ANY (
//     COALESCE(
//       (
//         SELECT
//           ARRAY_AGG(CAST(s AS INTEGER))
//         FROM
//           unnest(
//             string_to_array(
//               regexp_replace(ad."refRoleId"::text, '[{}]', '', 'g'),
//               ','
//             )
//           ) AS s
//         WHERE
//           s ~ '^\d+$'
//       ),
//       ARRAY[]::INTEGER[]
//     )
//   )
// WHERE
//   rp."hideStatus" IS NULL
// GROUP BY
//   ad."adminId";
// `;

export const deleteAdminQuery = `
UPDATE
  public."adminTable"
SET
  "isDelete" = true
WHERE
  "adminId" = $1`
  ;

  export const listAllProductsQuery = `
WITH
  "getProduct" AS (
    SELECT
      string_to_array(
        REPLACE(REPLACE(at."refProductsId", '{', ''), '}', ''),
        ','
      )::int[] AS "refProductsIdArray"
    FROM
      public."adminTable" at
    WHERE
      at."adminId" = $1
  )
SELECT
  *
FROM
  public."refProducts" rp
WHERE
  rp."refProductsId" = ANY (
    SELECT
      unnest("refProductsIdArray")
    FROM
      "getProduct"
  )
  AND rp."hideStatus" IS NULL
  `;
//   export const listAllProductsQuery = `
// SELECT
//   ad."refName",
//   ARRAY_REMOVE(ARRAY_AGG(DISTINCT rp."refProductsName"), NULL) AS "refProductsName"
// FROM
//   public."adminTable" ad
// LEFT JOIN public."refProducts" rp 
//   ON CAST(rp."refProductsId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(ad."refProductsId", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
// WHERE
//   EXISTS (
//     SELECT 1
//     FROM unnest(string_to_array(regexp_replace(ad."refProductsId", '[{}]', '', 'g'), ',')::int[]) AS t(id)
//     WHERE t.id = ANY ($1) AND ad."adminId" = $2
//   )
// GROUP BY
//   ad."adminId", ad."refName";

//   `;

  export const getAdminQuery = `
SELECT
  ad.*,
  json_agg(DISTINCT CAST(rp."refProductsId" AS INTEGER)) AS "refProductsIds",
  json_agg(DISTINCT rp."refProductsName") AS "refProductsNames",
  json_agg(DISTINCT CAST(r."refRoleId" AS INTEGER)) AS "refRoleIds",
  json_agg(DISTINCT r."refRoleName") AS "refRoleNames"
FROM
  public."adminTable" ad
  LEFT JOIN public."refProducts" rp ON CAST(rp."refProductsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(ad."refProductsId"::text, '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refRoleType" r ON CAST(r."refRoleId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(ad."refRoleId"::text, '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  ad."adminId" = $1
GROUP BY
  ad."adminId";
  `;



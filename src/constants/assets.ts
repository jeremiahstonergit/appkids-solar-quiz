export const ASSET_BASE = 'https://appkids.s3.regru.cloud/prototype/solar-system/v1'
export const asset = (folder: 'backgrounds' | 'heroes' | 'objects' | 'icons', file: string) =>
  `${ASSET_BASE}/${folder}/${file}`

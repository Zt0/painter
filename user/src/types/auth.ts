export class TokensDTO {
  accessToken: string
  refreshToken?: string
}

export type RequestWithUUID = unknown & {uuid: string}
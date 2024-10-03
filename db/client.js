import { createClient } from "@libsql/client"

const client = createClient({
	url: 'libsql://chemical-destinyfrog.turso.io',
	authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Mjc5MDk1NzUsImlkIjoiZTA1Njk1OGUtMjk3Ni00OTdjLTkyNTctNTdlYmMzZjQ0YTRmIn0.AvPRJAIbkX7RUHkLoG_jxvLSdIGHQbjXHuXrDZUBQsRp8c1FM52Z1ajRDBlnuwCyyaEpM55QuDkRKZpdFOqaBA'
})

export default client
import { RedisModules } from "@redis/client/dist/lib/commands"
import { createClient, RedisClientType } from "redis"

import { logger } from "@/lib/logger"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redisClient: RedisClientType<RedisModules, any, any> | undefined

const createClientConnection = async () => {
	const client = createClient({
		password: process.env.REDIS_PASSWORD,
		socket: {
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
		},
	})

	client.on("error", (err: Error) => {
		logger.error("Redis client error", err)
		process.exit(1)
	})

	client.on("connect", () =>
		logger.info(
			`Redis client connected on port ${process.env.REDIS_PORT ?? "6379"}`,
		),
	)

	await client.connect()

	return client
}

export const init = async () => {
	redisClient = await createClientConnection()

	return redisClient
}

export const getPrimary = () => {
	if (!redisClient) throw new Error("Redis client not initialized")

	return redisClient
}

export default {
	getPrimary,
	init,
}

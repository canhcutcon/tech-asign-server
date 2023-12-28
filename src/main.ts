import { compose, Options } from "@hapi/glue";
import path from "path";
import { fileURLToPath } from "url";
import laabr from 'laabr';
import routes from "./routes";

export async function bootstrap() {
	const options: Options = {
		relativeTo: path.dirname(fileURLToPath(import.meta.url)),
	};
	try {
		const server = await compose({
			server: {
				router: {
					isCaseSensitive: false,
					stripTrailingSlash: true,
				},
				port: 3011,
				routes: {
					cors: {
						origin: ["*"],
						credentials: true,
						additionalHeaders: ["cache-control", "x-requested-with"],
					},
					validate: {
						failAction: async (_, __, err) => {
							throw err;
						},
					},
				},
			},
		}, options);

		await server.register({
			plugin: laabr,
			options: {
				override: false,
				formats: {
					log: ":level - :message",
					response: ":method, :url, :status, :payload, (:responseTime ms)",
					"request-error":
						// eslint-disable-next-line max-len
						":method, :url, :payload, :error[output.statusCode], :error, :error[stack]",
					onPostStart: ":level - :message",
					onPostStop: ":level - :message",
				},
				indent: 0,
				colored: true,
				hapiPino: {
					prettyPrint: true,
					redact: ["req.headers.authorization"],
					mergeHapiLogData: true,
					ignoreFunc: (options: any, request: { path: string; method: string }) =>
						request.path.startsWith("/swagger") ||
						request.path.startsWith("/assets") ||
						request.path.includes("/favicon") ||
						request.path.includes("/upload/base64-image") ||
						request.path.includes("/upload/review/base64") ||
						request.method === "options",
					logPayload: true,
				},
			},
		});

		server.route(routes as any);

		server.start().then(async () => {
			console.info(`Server running on ${server.info.uri}`);
		});
	} catch (error) {
		console.log(" error:", error);
		console.error(error);
		process.exit(0);
	}
}

bootstrap();

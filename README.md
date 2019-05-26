# Prism

## Description
Prism is Orbs' block explorer. It enables you to see information about blocks, transactions and more.

## Getting started
1. Make sure you have [gamma-cli](https://github.com/orbs-network/gamma-cli) running.
2. Run `npm install`
3. Run `npm run dev` to spawn a nodejs server and a static server using Webpack.
4. Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration
The configuration of Prism is all done using environment variables. In the `.env` file there are several overrides which will help you work as a developer of Prism. For example: The `.env` overrides `FORCE_HTTPS` to `false` in order to have a simple developer envrounment.

**Note:** The `.env` file will be loaded only when not in `production` mode (`NODE_ENV='production'`).

|                                  | Description                                                                                                                      | Default Value | .env overrides                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------- |
| `FORCE_HTTPS`                    | Prism server will redirect to https if the call was to http                                                                      | `true`        | `false`                           |
| `PORT`                           | The server port                                                                                                                  | `3000`        |                                   |
| `ROLLBAR_ACCESS_TOKEN_CLIENT`    | Rollbar access token for Prism client. Not providing it will not report the client logs to Rollbar.                              | -             |                                   |
| `ROLLBAR_ACCESS_TOKEN_SERVER`    | Rollbar access token for Prism server. Not providing it will not report the server logs to Rollbar.                              | -             |                                   |
| `GOOGLE_ANALYTICS_KEY`           | Google Analytics Key. Not providing it will not report ro google analytics.                                                      | -             |                                   |
| `MINIFYED_REACT_JS`              | When `false`, the react developer version will be loaded. Useful when developing Prism                                           | `true`        | `false`                           |
| `LOG_TO_CONSOLE`                 | When `true`, all the server log will be visible in the console                                                                   | `true`        |                                   |
| `LOG_TO_FILE`                    | When `true`, all the server log will be written to a file.                                                                       | `false`       |                                   |
| `LOG_TO_ROLLBAR`                 | When `true`, all the server log will be send to Rollbar. You also must provide an ACCESS TOKEN                                   | `false`       |                                   |
| `DATABASE_TYPE`                  | Can be `MONGO` or `IN_MEMORY`. `IN_MEMORY` is useful only when developing Prism or in tests.                                     | `IN_MEMORY`   | `MONGO`                           |
| `MONGODB_URI`                    | When setting `DATABASE_TYPE` as `MONGO`. This is the connection Url we use to connect to monogo                                  | -             | `mongodb://localhost:27017/prism` |
| `DB_IS_READ_ONLY`                | When `true`, nothing will be added or removed from the db. Useful when you want to connect to a remote db without interfering.   | `false`       |                                   |
| `ORBS_ENDPOINT`                  | This is the address of the Orbs node.                                                                                            | -             | `http://localhost:8080`           |
| `ORBS_VIRTUAL_CHAIN_ID`          | The id of the virtual chain on the orbs node.                                                                                    | -             | `42`                              |
| `ORBS_NETWORK_TYPE`              | Can be `TEST_NET` or `MAIN_NET`.                                                                                                 | `TEST_NET`    |                                   |
| `POOLING_INTERVAL`               | Prism server uses pooling to "know" about new block, this is the interval between calls to the orbs node.                        | `2000`        |                                   |
| `GAP_FILLER_ACTIVE`              | Prism uses a gaps filler to fill missing blocks (Blocks that the pooling misses). Set this variable to `false` to deactivate it. | `true`        | `false`                           |
| `GAP_FILLER_INTERVAL_IN_MINUTES` | The interval that the gaps filler checks for gaps                                                                                | `30`          |                                   |

## Database
Prism's server uses a database to store all the blocks taken from Orbs' network. The default database in an in-memory database. While this is usful when developing Prism, it's not practicle in production. Aside from an in-memory database, Prism supports MongoDb (see `DATABASE_TYPE` in the configuration) provided by the `MONGODB_URI` environment variable.

From time to time, the database scheme will be upgraded/changed. In order for Prism to work with the latest scheme, you will have to stop Prism's server, drop the entire database, and restart the server. This will cause Prism to rebuild the database. Note that this is a slow process and there are many improvments planed in this area.


## License

MIT.

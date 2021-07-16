# electron-eventsource-test
Testing support for the EventSource API in Electron's Protocol Handlers

## What this does

I've been wanting to experiment with sending notifications from custom protocol handlers to web pages for stuff like watching for changes in p2p protocols.

With this test I found out the following:

- Sending events is pretty easy using Readable streams and async generators
- Dynamic event names are a no-go since there's no way to listen for _all_ event names
- Funky stuff in the message data can mess up the parsing, it's better to stick to JSON
- Closing a connection doesn't trigger the `finally` block immediately, but when you do the next `yield`, important to use for cleanup.

## How to use:

- clone the repo
- `npm install`
- `npm run start`
- Open devtools (ctrl+shift+i)
- You should see events in the console

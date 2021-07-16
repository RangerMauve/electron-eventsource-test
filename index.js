const { app, protocol, BrowserWindow } = require('electron')
const delay = require('delay')
const { Readable } = require('stream')

const RESEND_DELAY = 5000

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'example',
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnableed: true,
      stream: true
    }
  }
])

app.whenReady().then(() => {
  protocol.registerStreamProtocol('example', (request, sendResponse) => {
    console.log(request)
		const generator = makeStream(request.url)
		const stream = Readable.from(generator)

		// stream.once('close', () => generator.return(null))

    sendResponse({
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream'
      },
      data: Readable.from(makeStream(request.url))
    })
  })

  const window = new BrowserWindow()

  window.loadURL(`file://${__dirname}/index.html`)
})

async function * makeStream (url) {
  try {
    console.log('Making stream')

		let i = 0

    while (true) {
      const message = {
				url,
				text: 'Hello World!'
      }
      const toSend = `id: ${i++}
event: hello
data: ${JSON.stringify(message)}

`
      console.log('Sending', JSON.stringify(toSend))

      yield Buffer.from(toSend)

      console.log('Waiting')
      await delay(RESEND_DELAY)
    }
  } finally {
    console.log('Ended')
  }
}

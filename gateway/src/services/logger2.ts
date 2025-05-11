// Imports the Google Cloud client library
const {Logging} = require('@google-cloud/logging');
console.log(234234);
export async function quickstart(
  projectId = 'black-resource-347917', // Your Google Cloud Platform project ID
  logName = 'my-log' // The name of the log to write to
) {
  // Creates a client
  const logging = new Logging({projectId});

  // Selects the log to write to
  const log = logging.log(logName);

  // The data to write to the log
  const text = 'Hello, world!';

  // The metadata associated with the entry
  const metadata = {
    resource: {type: 'global'},
    // See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
    severity: 'INFO',
  };

  // Prepares a log entry
  const entry = log.entry(metadata, text);

  async function writeLog() {
    // Writes the log entry
    await log.write(entry);
    console.log(`Logged: ${text}`);
  }
  // writeLog();
}
quickstart().then(r => {console.log(r)})
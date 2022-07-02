/* eslint-disable @typescript-eslint/no-non-null-assertion */
import App from '.'

const app = new App({
  interval: 4000,
  filterContractAddress: process.env.MONITOR_FILTER_ADDRESS!,
  filterContractTopic: process.env.MONITOR_FILTER_TOPIC!,
  filterContractDelay: parseInt(process.env.MONITOR_FILTER_DELAY!),
  filterOwnerPK: process.env.MONITOR_FILTER_OWNER_PK!,
})
app
  .initialize()
  .then(() => {
    app.listen()
  })
  .catch((e) => console.log(e))

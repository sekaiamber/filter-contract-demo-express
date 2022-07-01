/* eslint-disable @typescript-eslint/no-non-null-assertion */
import App from '.'

const app = new App({
  interval: 4000,
  filterContractAddress: process.env.MONITOR_FILTER_ADDRESS!,
})
app
  .initialize()
  .then(() => {
    app.listen()
  })
  .catch((e) => console.log(e))

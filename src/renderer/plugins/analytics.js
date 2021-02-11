import ua from "universal-analytics"
import { machineIdSync } from "node-machine-id"

const uuid = machineIdSync()
const visitor = ua("UA-42820292-9", uuid, { strictCidFormat: false })
function trackEvent(category, action) {
  visitor
    .event({
      ec: category,
      ea: action,
    })
    .send()
}

export { visitor, trackEvent }

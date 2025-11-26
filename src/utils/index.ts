import { pick } from "lodash"


const getInfoData = <T>(fields: string[], dataObj: T) => {
    return pick(dataObj, fields)
}

export {
    getInfoData
}
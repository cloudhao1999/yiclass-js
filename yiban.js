import axios from 'axios'
import { CSRF, HEADERS } from './constant'

let access_token = ''
let name = ''
let phpSessionId = ''

axios.defaults.withCredentials = true

export async function login() {
    const params = {
        "account": '账户',
        "ct": 2,
        "identify": 0,
        "v": "4.7.4",
        "passwd": '密码'
    }

    const r = await axios.get('https://mobile.yiban.cn/api/v2/passport/login', { params })
    console.log(r)
    if (r && r['data']['response'] == "100") {
        access_token = r["data"]["data"]["access_token"]
        name = r["data"]["data"]["user"]["name"]
        console.log(access_token, name)
        return r
    } else {
        console.log("null")
        return null
    }
}

export async function auth() {
    const response = await axios.get(`http://f.yiban.cn/iapp/index?act=iapp7463&v=${access_token}`)
    console.log(response.request.res.responseUrl)
    const location = response.request.res.responseUrl
    const verifyRequest = location.slice(39)
    console.log(verifyRequest)
    const res =await axios.get(`https://api.uyiban.com/base/c/auth/yiban?verifyRequest=${verifyRequest}&CSRF=${CSRF}`, {
        headers: HEADERS
    })
    console.log(res)
    const cookie = res.headers["set-cookie"][0]
    console.log(cookie)
    phpSessionId = cookie.split(";")[0]
    console.log(phpSessionId)
    return res.data;
}

export async function getUncompletedList(){
    const res = await axios.get(`https://api.uyiban.com/officeTask/client/index/uncompletedList?CSRF=${CSRF}`, {
        headers: { "Origin": "https://c.uyiban.com", "User-Agent": "yiban","Cookie":`${phpSessionId};csrf_token=aaabbb`}
    })
    console.log(res.data.data)
}
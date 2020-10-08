import axios from 'axios'
import { CSRF, HEADERS } from './constant'
import { parse_data } from './utils'


let access_token = ''
let name = ''
let phpSessionId = ''
let WFId = ''

axios.defaults.withCredentials = true

export async function login() {
    const params = {
        "account": '易班号码，一般是手机号', //易班号码，一般是手机号
        "ct": 2,
        "identify": 0,
        "v": "4.7.4",
        "passwd": '易班密码' //易班密码
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
    return res.data.data
}

export async function getCompletedList(){
    const res = await axios.get(`https://api.uyiban.com/officeTask/client/index/completedList?CSRF=${CSRF}`, {
        headers: { "Origin": "https://c.uyiban.com", "User-Agent": "yiban","Cookie":`${phpSessionId};csrf_token=aaabbb`}
    })
    return res.data.data
}

export async function getTaskDetail(id){
    const res = await axios.get(`https://api.uyiban.com/officeTask/client/index/detail?TaskId=${id}&CSRF=${CSRF}`, {
        headers: { "Origin": "https://c.uyiban.com", "User-Agent": "yiban","Cookie":`${phpSessionId};csrf_token=aaabbb`}
    })
    console.log(res.data)
    WFId = res.data.data.WFId
    return res.data
}

export async function submit(extend){
    parse_data().then(res=>{
        const params = {
            "data": res,
            "extend": JSON.stringify(extend)
        }
        console.log(params)
        console.log(WFId)
        // 刚刚才写的还没试过可不可以，要是没打卡可以自己试试看
        // axios.post(`https://api.uyiban.com/workFlow/c/my/apply/${WFId}?CSRF=${CSRF}`,{
        //     params=params,
        //     headers: { "Origin": "https://c.uyiban.com", "User-Agent": "yiban","Cookie":`${phpSessionId};csrf_token=aaabbb`}
        // }).then(res=>{
        //     console.log(res)
        // })
        console.log("模拟打卡成功")
    })
}

export async function getShareUrl(initiateId){
    const res = await axios.get(`https://api.uyiban.com/workFlow/c/work/share?InitiateId=${initiateId}&CSRF=${CSRF}`,{
        headers: { "Origin": "https://c.uyiban.com", "User-Agent": "yiban","Cookie":`${phpSessionId};csrf_token=aaabbb`}
    })
    return res.data
}
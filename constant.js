// 疫情表单：固定表单值固定 每个大学可能不一样需要自行抓包 此处为闽江学院2020/10/08
// 午检WFId
export const WFId1 = "85ad685f37485e51c905d243dd80413e"  
// 晚检WFId
export const WFId2 = "a52a36ecb810e25060e1b33e3c718223"
// 随机值 随便填点东西
export const CSRF = "aaabbb"  
// 固定cookie 无需更改
export const COOKIES = { "csrf_token": CSRF }  
// 固定头 无需更改
export const HEADERS = { "Origin": "https://c.uyiban.com", "User-Agent": "yiban","Cookie":'csrf_token=aaabbb' }  
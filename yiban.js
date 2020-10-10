import axios from "axios";
import { CSRF, HEADERS } from "./constant";
import { parse_data } from "./utils";
import qs from "qs";

let access_token = "";
let name = "";
let phpSessionId = "";
let WFId = "";
let cpi = "";

let params = {
  account: "易班号码，一般是手机号", //易班号码，一般是手机号
  ct: 2,
  identify: 0,
  v: "4.7.4",
  passwd: "易班密码", //易班密码
};

axios.defaults.withCredentials = true;

export async function login(
  name = "易班号码，一般是手机号",
  passwd = "易班密码"
) {
  params["account"] = name;
  params["passwd"] = passwd;

  const r = await axios.get("https://mobile.yiban.cn/api/v2/passport/login", {
    params,
  });
  console.log(r);
  if (r && r["data"]["response"] == "100") {
    access_token = r["data"]["data"]["access_token"];
    name = r["data"]["data"]["user"]["name"];
    console.log(access_token, name);
    return r;
  } else {
    return null;
  }
}

export async function auth() {
  const response = await axios.get(
    `http://f.yiban.cn/iapp/index?act=iapp7463&v=${access_token}`
  );
  console.log(response.request.res.responseUrl);
  const location = response.request.res.responseUrl;
  const verifyRequest = location.slice(39);
  console.log(verifyRequest);
  const res = await axios.get(
    `https://api.uyiban.com/base/c/auth/yiban?verifyRequest=${verifyRequest}&CSRF=${CSRF}`,
    {
      headers: HEADERS,
    }
  );
  console.log(res.headers["set-cookie"]);
  const cookie = res.headers["set-cookie"][0];
  const cookieCpi = res.headers["set-cookie"][1];
  phpSessionId = cookie.split(";")[0];
  cpi = cookieCpi.split(";")[0];
  return res.data;
}

export async function getUncompletedList() {
  const res = await axios.get(
    `https://api.uyiban.com/officeTask/client/index/uncompletedList?CSRF=${CSRF}`,
    {
      headers: {
        Origin: "https://c.uyiban.com",
        "User-Agent": "yiban",
        Cookie: `${phpSessionId};${cpi};csrf_token=aaabbb`,
      },
    }
  );
  return res.data.data;
}

export async function getCompletedList() {
  const res = await axios.get(
    `https://api.uyiban.com/officeTask/client/index/completedList?CSRF=${CSRF}`,
    {
      headers: {
        Origin: "https://c.uyiban.com",
        "User-Agent": "yiban",
        Cookie: `${phpSessionId};${cpi};csrf_token=aaabbb`,
      },
    }
  );
}

export async function getTaskDetail(id) {
  const res = await axios.get(
    `https://api.uyiban.com/officeTask/client/index/detail?TaskId=${id}&CSRF=${CSRF}`,
    {
      headers: {
        Origin: "https://c.uyiban.com",
        "User-Agent": "yiban",
        Cookie: `${phpSessionId};${cpi};csrf_token=aaabbb`,
      },
    }
  );
  WFId = res.data.data.WFId;
  return res.data;
}

export async function submit(extend, form) {
  const params = {
    data: form,
    extend: JSON.stringify(extend),
  };
  console.log(params);
  console.log(WFId);
  const res = await axios({
    method: "post",
    url: `https://api.uyiban.com/workFlow/c/my/apply/${WFId}?CSRF=${CSRF}`,
    data: qs.stringify(params),
    headers: {
      Origin: "https://c.uyiban.com",
      "User-Agent": "yiban",
      Cookie: `${phpSessionId};${cpi};csrf_token=aaabbb`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log(res);
  console.log(
    `打卡成功,分享的链接为：https://app.uyiban.com/workflow/client/#/share?initiateId=${res.data.data}`
  );
  return res.data;
}

export async function getFormDetail(WFId) {
  console.log(WFId);
  const res = await axios.get(
    `https://api.uyiban.com/workFlow/c/my/form/${WFId}?CSRF=${CSRF}`,
    {
      headers: {
        Origin: "https://c.uyiban.com",
        "User-Agent": "yiban",
        Cookie: `${phpSessionId};${cpi};csrf_token=aaabbb`,
      },
    }
  );
  console.log(res);
  return res.data;
}

export async function getShareUrl(initiateId) {
  const res = await axios.get(
    `https://api.uyiban.com/workFlow/c/work/share?InitiateId=${initiateId}&CSRF=${CSRF}`,
    {
      headers: {
        Origin: "https://c.uyiban.com",
        "User-Agent": "yiban",
        Cookie: `${phpSessionId};${cpi};csrf_token=aaabbb`,
      },
    }
  );
  return res.data;
}

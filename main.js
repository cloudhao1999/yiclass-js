import {
  login,
  auth,
  getUncompletedList,
  getTaskDetail,
  getFormDetail,
  submit,
} from "./yiban";
import { WFId1, WFId2 } from "./constant";

const express = require("express");
const cors = require("cors")
const app = express();
const port = 8083;

app.use(cors())
app.use(express.json())
app.use('/',express.static(__dirname+'/yiban'))

app.get("/submit", (req, res) => {
  // 登录易班接口
  login().then((res) => {
    let isLogin = res;
    if (isLogin === null) {
      console.log("帐号或密码错误,请确认账号密码密码无误后重试");
    } else {
      console.log("登录成功，进行二次校验");
      auth().then((res) => {
        const data_url = res.data.Data;
        if (data_url !== undefined) {
          console.log("授权过期");
        } else {
          console.log("授权成功");
          getUncompletedList().then((res) => {
            const localTime = Math.floor(new Date().getTime() / 1000);
            console.log(`当前时间:${localTime}`);
            if (res.length === 0) {
              console.log("没有新的任务");
            } else {
              const all_task = res.filter((item) => {
                if (localTime >= item.StartTime) {
                  //其实是>=,但是这样我后面测不了数据所以先不改了
                  return true;
                }
              });
              console.log("当前需要打卡的任务");
              console.log(all_task);
              all_task.forEach((task) => {
                getTaskDetail(task.TaskId).then((res) => {
                  if (res.data.WFId !== WFId1 && res.data.WFId !== WFId2) {
                    console.log("表单已更新,得更新程序了");
                  } else {
                    console.log("表单未做修改，开始提交");
                    const task_detail = res.data;
                    const ex = {
                      TaskId: task_detail["Id"],
                      title: "任务信息",
                      content: [
                        { label: "任务名称", value: task_detail["Title"] },
                        { label: "发布机构", value: task_detail["PubOrgName"] },
                        {
                          label: "发布人",
                          value: task_detail["PubPersonName"],
                        },
                      ],
                    };
                    submit(ex).then(res=>{
                      console.log(res)
                      if(res.code===0){
                        res.send('打卡成功。。。')
                      }
                    })
                  }
                });
              });
            }
          });
        }
      });
    }
  });
  res.send('打卡中。。。')
});

app.get("/form_detail",(req,resp)=>{
  const {WFId} = req.query
  login().then((res) => {
    let isLogin = res;
    if (isLogin === null) {
      console.log("帐号或密码错误,请确认账号密码密码无误后重试");
    } else {
      console.log("登录成功，进行二次校验");
      auth().then((res) => {
        const data_url = res.data.Data;
        if (data_url !== undefined) {
          console.log("授权过期");
        } else {
          console.log("授权成功");
          getFormDetail(WFId).then(response=>{
            console.log(response)
            resp.send(response)
          })
        }
      });
    }
  });
  
})

// 获取之前填过的表单的信息，从而进行复用数据

app.post("/formPost",(req,response)=>{
  const {form,name,passwd} = req.body

  // 登录易班接口
  login(name,passwd).then((res) => {
    let isLogin = res;
    if (isLogin === null) {
      console.log("帐号或密码错误,请确认账号密码密码无误后重试");
      response.status(200).send({"code":500,"msg":"帐号或密码错误,请确认账号密码密码无误后重试"})
    } else {
      console.log("登录成功，进行二次校验");
      auth().then((res) => {
        const data_url = res.data.Data;
        if (data_url !== undefined) {
          console.log("授权过期");
        } else {
          console.log("授权成功");
          getUncompletedList().then((res) => {
            const localTime = Math.floor(new Date().getTime() / 1000);
            console.log(`当前时间:${localTime}`);
            if (res.length === 0) {
              console.log("没有新的任务");
            } else {
              const all_task = res.filter((item) => {
                if (localTime >= item.StartTime) {
                  return true;
                }
              });
              console.log("当前需要打卡的任务");
              console.log(all_task);
              if(all_task.length===0){
                response.status(200).send({"code":500,"msg":"当前暂无需要打卡的任务"})
              }
              all_task.forEach((task) => {
                getTaskDetail(task.TaskId).then((res) => {
                  if (res.data.WFId !== WFId1 && res.data.WFId !== WFId2) {
                    console.log("表单已更新,得更新程序了");
                    response.status(200).send({"code":500,"msg":"表单已更新,得更新程序了"})
                  } else {
                    console.log("开始提交");
                    const task_detail = res.data;
                    const ex = {
                      TaskId: task_detail["Id"],
                      title: "任务信息",
                      content: [
                        { label: "任务名称", value: task_detail["Title"] },
                        { label: "发布机构", value: task_detail["PubOrgName"] },
                        {
                          label: "发布人",
                          value: task_detail["PubPersonName"],
                        },
                      ],
                    };
                    submit(ex,form).then(res=>{
                      console.log(res)
                      if(res.code===0){
                        res.send({"code":200,"msg":"打卡成功"})
                      }
                    })
                  }
                });
              });
            }
          });
        }
      });
    }
  });
})

app.listen(port, () => {
  console.log("App start on http://localhost:8083");
});

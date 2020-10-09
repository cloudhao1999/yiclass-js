import {
  login,
  auth,
  getUncompletedList,
  getTaskDetail,
  submit,
} from "./yiban";
import { WFId1, WFId2 } from "./constant";

const express = require("express");
const app = express();
const port = 8000;

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
                    submit(ex);
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

// 获取之前填过的表单的信息，从而进行复用数据

app.listen(port, () => {
  console.log("App start on http://localhost:8000");
});

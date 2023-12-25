import { useEffect } from "react";
import { useAccessStore } from "../store";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import styles from "./login.module.scss";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useAppConfig } from "../store/config";
import axios from "axios";
const errorMes: any = {
  10001: "用户名或者密码错误",
  10002: "参数错误,请检查",
  10003: "没有登录,请先登录",
};
type FieldType = {
  username?: string;
  password?: string;
};
export function Login() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const goChat = () => navigate(Path.Chat);
  const config = useAppConfig();
  const updateConfig = config.update; //更新配置项  isAdmin

  const onFinish = (values: any) => {
    axios.post("/spider-gpt/user/login", values).then((res: any) => {
      if (res.status == 200) {
        accessStore.update((access) => {
          access.accessCode = "Hqy@2023";
          access.accessToken = res.data.data.token;
          access.userInfo = res.data.data;
        });
        if (
          res.data.data.displayName == "颜涛" ||
          res.data.data.displayName == "黄勇"
        ) {
          updateConfig((config) => {
            config.isAdmin = true;
          });
        }
        goChat();
      } else {
        message.error(errorMes[res.status]);
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className={styles["content"]}>
      <div className={styles["form"]}>
        <h2>用户登录</h2>
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input
              placeholder="请输入公司账号"
              style={{ width: "200px", borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              placeholder="请输入密码"
              style={{ width: "200px" }}
              className={styles["password"]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

import React from "react";
import axios from "commons/axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Login(props) {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async data => {
    //獲取表單值
    console.log(data);
    //處理登陸
    try {
      const { email, password } = data;
      const res = await axios.post("/auth/login", { email, password });
      const jwToken = res.data;
      console.log(jwToken);
      global.auth.setToken(jwToken);
      toast.success("Login Success");
       //跳轉到首頁
    props.history.push('/');
    } catch (error) {
      console.log(error.response.data);
      const message = error.response.data.message;
      toast.error(message);
    }

   
  };
  console.log(errors);

  return (
    <div className="login-wrapper">
      <form className="box login-box" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Email:</label>
          <div className="control">
            <input
              className={`input ${errors.email && "is-danger"}`}
              type="text"
              name="email"
              placeholder="Email"
              ref={register({
                required: "email is require",
                pattern: {
                  value: /^[A-Za-z0-9]+([_\\.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\.)+[A-Za-z]{2,6}$/,
                  message: "invalid mail"
                }
              })}
            />
            {errors.email && (
              <p className="helper has-text-danger">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="field">
          <label className="label">Password:</label>
          <div className="control">
            <input
              className={`input ${errors.password && "is-danger"}`}
              type="password"
              name="password"
              placeholder="Password"
              ref={register({
                required: "password is required",
                minLength: {
                  value: 6,
                  message: "cannot be less than 6 digits"
                }
              })}
            />
            {errors.password && (
              <p className="helper has-text-danger">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <div className="control">
          <button className="button is-fullwidth is-primary">Login</button>
        </div>
      </form>
    </div>
  );
}

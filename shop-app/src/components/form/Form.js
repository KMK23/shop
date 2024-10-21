import React from "react";
import styles from "./Form.module.scss";
import { useForm } from "react-hook-form";

function Form({ title, getDataForm, firebaseError }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });
  // 이건 formState를 위한 객체임 ==> onChange를 써서 (  ex) 정규식일때 ) 변경될때마다 확인 하는거야. error를..
  //정규식을 쓰고 싶다면 useEffect 안에 디펜던시 리스트 에다가 formState를 넣고 변경될때마다 확인하면 되는거지

  // mode는 submit 되기 이전에 발생하는 것
  //   console.log(useForm());
  //   console.log(errors);

  const onSubmit = ({ email, password }) => {
    getDataForm(email, password);
    reset();
  };
  // 순서를 잘기억해봐. signUp 에서 만든것들을 getDataForm 을 prop으로 가져와서 useForm 사용할때(react-hook-form)
  const userEmail = {
    required: "필수 필드입니다.",
  };
  const userPassword = {
    reiquired: "필수 필드입니다.",
    minLength: {
      value: 6,
      message: "최소 6자 입니다.",
    },
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email", userEmail)}
        />
        {errors?.email && (
          <div>
            <span className={styles.form_error}>{errors.email.message}</span>
          </div>
        )}
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password", userPassword)}
        />
        {errors?.password && (
          <div>
            <span className={styles.form_error}>{errors.password.message}</span>
          </div>
        )}
      </div>
      <button>{title}</button>
      {firebaseError && (
        <span className={styles.form_error}>{firebaseError}</span>
      )}
    </form>
  );
}

export default Form;

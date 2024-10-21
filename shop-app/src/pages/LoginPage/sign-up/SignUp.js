import React, { useState } from "react";
import Form from "../../../components/form/Form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { syncCart, getUserAuth, joinUser } from "../../../firebase";
import { setUser } from "../../../store/user/userSlice";
import { useNavigate } from "react-router-dom";

function SignUp(props) {
  const [firebaseError, setFirebaseError] = useState("");
  const dispatch = useDispatch();
  const auth = getUserAuth();
  const navigate = useNavigate();
  const handleSignUpAndLogin = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { user } = userCredential;
      // 로컬스토리지에서 장바구니 데이터 읽기
      const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];

      await joinUser(user.uid, user.email);
      //회원가입 시키기

      await syncCart(user.uid, cartItems);
      //이건 동기화하는것
      dispatch(
        setUser({ email: user.email, token: user.refreshToken, uid: user.uid })
      );
      navigate("/");
    } catch (error) {
      console.log(error);
      setFirebaseError("이메일 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <Form
      title={"회원가입"}
      getDataForm={handleSignUpAndLogin}
      firebaseError={firebaseError}
    />
  );
}

export default SignUp;

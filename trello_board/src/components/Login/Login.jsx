import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";

import styles from "./Login.module.css";
import { getItem, setItem } from "../../utilities/localStorage";

let initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [form, setForm] = useState(initialState);
  const history = useHistory();
  const [openSnackbar] = useSnackbar({
    position: "top-center",
  });

  useEffect(() => {
    let token = getItem("token");
    if (token !== null && token !== undefined) {
      history.push("/home");
    }
  }, []);

  const handleForm = (e) => {
    let { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
        storedUser &&
        form.email === storedUser.email &&
        form.password === storedUser.password
    ) {
      setItem("token", "123456");
      openSnackbar("Login successful!");
      history.push("/home");
    } else {
      openSnackbar("Invalid credentials.");
    }
  };

  const handleNavigateToRegister = () => {
    history.push("/register");
  };

  const { email, password } = form;
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_item}>
          <strong>Email</strong>
          <br />
          <input
            name='email'
            type='email'
            // placeholder='Enter your email'
            value={email}
            required={true}
            onChange={handleForm}
          />
        </div>
        <div className={styles.form_item}>
          <strong>Password</strong>
          <br />
          <input
            name='password'
            type='password'
            // placeholder='Enter your password'
            value={password}
            required={true}
            onChange={handleForm}
          />
        </div>
        <div className={styles.form_item_btn}>
          <input type='submit' value='Login' />
        </div>
      </form>
      <div className={styles.options}>
        Not a user? | <span onClick={handleNavigateToRegister}>Register</span>
      </div>
    </div>
  );
};

export { Login };

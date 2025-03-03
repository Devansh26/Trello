import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";

import styles from "./Register.module.css";

const initialState = {
  name: "",
  email: "",
  password: "",
};
const Register = () => {
  const [form, setForm] = useState(initialState);
  const history = useHistory();
  const [openSnackbar] = useSnackbar({
    position: "top-center",
  });

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation (replace with more robust validation)
    if (!form.name || !form.email || !form.password) {
      openSnackbar("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      openSnackbar("Password should be at least 6 characters long.");
      return;
    }

    // Store user data in local storage
    localStorage.setItem("user", JSON.stringify(form));

    openSnackbar("Registration successful. Please login.");
    setForm(initialState);
    history.push("/");
  };

  const handleNavigateToLogin = () => {
    history.push("/");
  };

  const { name, email, password } = form;
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_item}>
          <strong>Name</strong>
          <br />
          <input
            name='name'
            type='text'
            // placeholder='Enter the name'
            value={name}
            onChange={handleForm}
            required={true}
          />
        </div>
        <div className={styles.form_item}>
          <strong>Email</strong>
          <br />
          <input
            name='email'
            type='email'
            // placeholder='Enter the email'
            value={email}
            onChange={handleForm}
            required={true}
          />
        </div>
        <div className={styles.form_item}>
          <strong>Password</strong>
          <br />
          <input
            name='password'
            type='password'
            // placeholder='Enter the password'
            value={password}
            onChange={handleForm}
            required={true}
          />
        </div>
        <div className={styles.form_item_btn}>
          <input type='submit' value='Register' />
        </div>
      </form>
      <div className={styles.options}>
        Already a user? | <span onClick={handleNavigateToLogin}>Login</span>
      </div>
    </div>
  );
};

export { Register };

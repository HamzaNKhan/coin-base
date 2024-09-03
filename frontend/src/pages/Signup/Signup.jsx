import { useState } from "react";
import styles from "./signup.module.css";
import TextInput from "../../components/TextInput/TextInput";
import signupSchema from "../../schemas/signupSchema";
import { useFormik } from "formik";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { singup } from "../../api/internal";

//signup

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleSignup = async () => {
        const data = {
            name: values.name,
            username: values.username,
            password: values.password,
            confirmPassword: values.confirmPassword,
            email: values.email,
          };
    const response = await singup(data);
    console.log('Here');

    if (response.status === 201) {
      //1. set Global User
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth,
      };
      //1.1 Updating redux state
      dispatch(setUser(user));

      //2. redirect Homepage
      navigate("/");
    } else if ((response.code = "ERR_BAD_REQUEST")) {
        console.log('error');

      //display error message
      // console.log('here');

      setError(response.response.data.message);
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
  });

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupHeader}>Create and account</div>
        <TextInput
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="name"
          error={errors.name && touched.name ? 1 : undefined}
          errormessage={errors.name}
        />

        <TextInput
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="username"
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />

        <TextInput
          type="text"
          name="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="email"
          error={errors.email && touched.email ? 1 : undefined}
          errormessage={errors.password}
        />
        <TextInput
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="password"
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
        <TextInput
          type="password"
          value={values.confirmPassword}
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="confirmPassword"
          error={
            errors.confirmPassword && touched.confirmPassword ? 1 : undefined
          }
          errormessage={errors.confirmPassword}
        />

        <button className={styles.signupButton} 
        disabled={
          !values.username || 
          !values.password ||
          !values.confirmPassword ||
          !values.name || 
          !values.email ||
          errors.username || 
          errors.password ||
          errors.confirmPassword ||
          errors.name ||
          errors.email
          
          
          } onClick={handleSignup}>
          Log in
        </button>
        <span>
          Already have an account?{" "}
          <button className={styles.login} onClick={() => navigate("/login")}>
            Register
          </button>
        </span>

        {error != "" ? <p className={styles.errorMessage}>{error}</p> : ""}
      </div>
  );
}

export default Signup;
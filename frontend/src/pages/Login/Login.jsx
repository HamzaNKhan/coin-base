import { useState } from 'react';
import styles from './Login.module.css';
import TextInput from '../../components/TextInput/TextInput';
import loginSchema from '../../schemas/loginSchema';
import { useFormik } from 'formik';
import { login } from '../../api/internal';
import {setUser} from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState('');

    const handleLogin = async()=>{
        const data = {
            username: values.username,
            password: values.password
        }
        const response = await login(data)
        // console.log(response);
        
        if(response.status === 200){
            //1. setUser
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth,
            };
            dispatch(setUser(user));
            
            //2. redirect Homepage
            navigate('/')


        }

        else if(response.code='ERR_BAD_REQUEST'){
            //display error message
            // console.log('here');

            setError(response.response.data.message);

        }
    }

    const {values, touched, handleBlur, handleChange, errors} = useFormik({ 
        initialValues:{
            username: '',
            password: ''
        },
        validationSchema: loginSchema
    })

    return <div className={styles.logInWrapper}>
        <div className={styles.logInHeader}> Log into your account</div>
        <TextInput  
            type= "text"
            value= {values.username}
            name= "username"
            onBlur= {handleBlur}
            onChange = {handleChange}
            placeholder = "username"
            error={errors.username && touched.username ? 1: undefined}
            errormessage= {errors.username}

        />
        <TextInput
            type= "password"
            value= {values.password}
            name= "password"
            onBlur= {handleBlur}
            onChange = {handleChange}
            placeholder = "password"
            error={errors.password && touched.password ? 1: undefined}
            errormessage= {errors.password}
        />
        <button className={styles.loginButton} disabled={!values.username || !values.password || errors.username || errors.password} onClick={handleLogin}>Log in</button>

        <span>Don't have an account? <button className={styles.createAccount} onClick={() => navigate('/signup')}>Register</button></span>
        {error != ''?<p className={styles.errorMessage}>{error}</p>:""}
    </div>
}

export default Login;

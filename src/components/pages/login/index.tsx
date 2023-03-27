import { useEffect } from 'react';
import css from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { signin, googlesignin } from '../../../api/auth';
import { useAuthCtx } from '../../../store/authProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth } from '../../../api/config';
import { Google } from '@styled-icons/boxicons-logos/Google';

const formValidation = Yup.object({
  email: Yup.string().trim().email().required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Minimum 8 characters required')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isUserLoggedIn } = useAuthCtx();

  useEffect(() => {
    if (isUserLoggedIn) navigate('/');
  }, [isUserLoggedIn, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: formValidation,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, action) => {
      try {
        const respUserData = await signin(values.email, values.password);
        if (respUserData) {
          action.resetForm();
          login(respUserData);
          navigate('/');
          return;
        }
        alert('Login failed');
      } catch (err) {
        console.log('Login failed', err);
        alert('Something went wrong');
      }
    },
  });

  const goToRegisterPage = () => {
    navigate('/register');
  };

  const loginWithGoogle = async () => {
    const respUserData = await googlesignin();
    if (respUserData) {
      login(respUserData);
      navigate('/');
    }
  };

  return (
    <>
      {!isUserLoggedIn && (
        <div className={css.mainContainer}>
          <h1 className={css.header}>Sign in to Cashbit</h1>
          <Google
            className={css.iconEl}
            onClick={loginWithGoogle}
            role="button"
          />
          <p>or use your email account</p>
          <form className={css.formContainer} onSubmit={formik.handleSubmit}>
            <div>
              <div className={css.inputContainer}>
                <input
                  className={css.inputElement}
                  name="email"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="Email"
                  // isInvalid={!!formik.touched.email && !!formik.errors.email}
                  // errorBorderColor="crimson"
                />
                <span className={css.error}>
                  {formik.touched.email && formik.errors.email}
                </span>
              </div>
              <div className={css.inputContainer}>
                <input
                  className={css.inputElement}
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Password"
                  // isInvalid={
                  //   !!formik.touched.password && !!formik.errors.password
                  // }
                  // errorBorderColor="crimson"
                />
                <span className={css.error}>
                  {formik.touched.password && formik.errors.password}
                </span>
              </div>
            </div>
            <div>
              <div>
                <button className={css.buttonEl} type="submit">
                  SIGN IN
                </button>
              </div>

              <p>
                Don&apos;t have an account? Register{' '}
                <span
                  className={css.textButton}
                  onClick={goToRegisterPage}
                  role="button"
                >
                  here
                </span>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;

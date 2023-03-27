import css from './register.module.css';
import { useNavigate } from 'react-router-dom';
import { signup, googlesignin } from '../../../api/auth';
import { useAuthCtx } from '../../../store/authProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Google } from '@styled-icons/boxicons-logos/Google';

const formValidation = Yup.object({
  email: Yup.string().trim().email().required('Email is required'),
  password: Yup.string()
    .trim()
    .min(8, 'Minimum 8 characters required')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthCtx();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: formValidation,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, action) => {
      try {
        const respUserData = await signup(values.email, values.password);
        if (respUserData) {
          action.resetForm();
          login(respUserData);
          navigate('/');
          return;
        }
        alert('Registration failed');
      } catch (err) {
        console.log('Registration failed', err);
        alert('Something went wrong');
      }
    },
  });

  const goToLoginPage = () => {
    navigate('/login');
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
      <div className={css.mainContainer}>
        <h1 className={css.header}>Create Account</h1>
        <Google
          className={css.iconEl}
          onClick={loginWithGoogle}
          role="button"
        />
        <p>or use your email for registration</p>
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
            <div className={css.inputContainer}>
              <input
                className={css.inputElement}
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder="Confirm password"
                // isInvalid={
                //   !!formik.touched.confirmPassword &&
                //   !!formik.errors.confirmPassword
                // }
                // errorBorderColor="crimson"
              />
              <span className={css.error}>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </span>
            </div>
          </div>
          <div>
            <div>
              <button className={css.buttonEl} type="submit">
                SIGN UP
              </button>
            </div>
            <p>
             Go back to login page{' '}
              <span
                className={css.textButton}
                onClick={goToLoginPage}
                role="button"
              >
                here
              </span>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;

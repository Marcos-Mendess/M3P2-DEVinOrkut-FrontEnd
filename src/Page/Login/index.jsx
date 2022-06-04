import React, { useEffect } from 'react';
import {
  StyledBackground,
  StyledFormCard,
  StyledInput,
} from '../SendResetPassEmail/style';
import Logo from '../../Assets/images/Title.svg';
import { LOGIN_MUTATION } from '../../Graphql/Mutations/index';
import { Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { BootstrapCarousel } from '../../Components/Carousel/Carousel';
import { useData } from '../../Context/dataContext';
import { LabLogo, PinkCard, LabLogoDiv } from './style';

export default function Login() {
  const { user, handleLogin } = useData()
  const navigate = useNavigate();
  let [Login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const arrayString = ["Encontre seus velhos amigos!",
  "A mais nostálgica rede social da década está de volta",
  " Tudo para que você possa se conectar com os seus amigos"]


  useEffect(() => {
    if (user.token) {
      localStorage.setItem('Token', user.token);
    }
  }, [user.token])


  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .email('Formato de email inválido')
          .required('Email é obrigatório'),
        password: Yup.string().required('Senha é obrigatória'),
      }),
      onSubmit: async ({ email, password }) => {
          const response = await Login({
            variables: {
              email: email,
              password: password,
            },
          });
          const { data } = response;
          const { token, user } = data.login;
          user.token = token
          handleLogin(user)
      },
    });

  if (loading)
    return (
      <StyledBackground>
        <StyledFormCard>
          <Col md={6}>
            <img src={Logo} alt="DEVinOrkut" width="150" />
          </Col>
          <h3>Verificando</h3>
        </StyledFormCard>
      </StyledBackground>
    );
  if (data)
    return (
      localStorage.setItem('Token', data.login.token),
      setTimeout(() => {
        navigate('/');
      }, 2000),
      (
        <StyledBackground>
          <StyledFormCard>
            <Col md={6}>
              <img src={Logo} alt="DEVinOrkut" width="150" />
            </Col>
            <h3>Bem vindo de volta</h3>
            <h4>{data.login.user.fullName}</h4>
          </StyledFormCard>
        </StyledBackground>

      )
    );

  return (
    
    <StyledBackground>
      
      <StyledFormCard onSubmit={handleSubmit}>
      
      
        <h3>Fazer o Login</h3>
        <div>
          <label htmlFor="email">Email</label>
          <StyledInput
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
            name="email"
            placeholder="Digite seu email"
            type="text"
          />
          {touched.email && errors.email ? <p>{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor="password">Confirmar senha</label>
          <StyledInput
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            name="password"
            placeholder="Digite sua senha"
            type="password"
          />
          {touched.password && errors.password ? (
            <p>{errors.password}</p>
          ) : null}
        </div>
        <StyledInput value="Enviar" type={'submit'} />
        {error ? (
          <p style={{ color: 'yellow', fontWeight: 'bold', textAlign: 'center' }}>
            {error.message}
          </p>
          ) : null}
          
      </StyledFormCard>
     <PinkCard>
      <LabLogoDiv> <LabLogo></LabLogo></LabLogoDiv>
     
          <img src={Logo} alt="DEVinOrkut" width="250" style={{marginBottom:"22%"}} />
       
     <BootstrapCarousel
      arrayString={ arrayString}/>
     </PinkCard>
    </StyledBackground>
    
  );
}

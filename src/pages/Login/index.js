import styles from "../../styles/Login.module.css";
import Link from "next/link";
import validator from "validator";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";

export default function Login() {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleSignIn(data) {
    try {
      signIn("credentials", {
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setError(error.message);
    }
  }

  const { data: session, status } = useSession();

  return (
    console.log(session, "session"),
    <div className={styles.main}>
      <div className={styles.img_container}></div>
      <div className={styles.form_container}>
        <h1>Faça seu Login</h1>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <label htmlFor="email">E-mail</label>
          <input
            className={errors?.email && styles.input_error}
            id="email"
            type="email"
            {...register("email", {
              required: true,
              validate: (value) => validator.isEmail(value),
            })}
          />
          {errors?.email?.type === "required" && (
            <p className={styles.error_message}>Insira um e-mail</p>
          )}
          {errors?.email?.type === "validate" && (
            <p className={styles.error_message}>
              O e-mail é inválido. Formato esperado: exemplo@exemplo.com
            </p>
          )}
          {error && <p className={styles.error_message}>{error}</p>}

          <label htmlFor="password">Senha</label>
          <input
            className={errors?.password && styles.input_error}
            id="password"
            type="password"
            {...register("password", {
              required: true,
            })}
          />
          {errors?.password?.type === "required" && (
            <p className={styles.error_message}>Insira uma senha</p>
          )}
          {error && <p className={styles.error_message}>{error}</p>}

          <Link className={styles.forget_password} href="/forget-password">
            Esqueci minha senha
          </Link>

          <button type="submit">Entrar</button>
        </form>
        <div className={styles.orLine}>
          <hr />
        </div>
        <div className={styles.container_button}>
          <button
            className={styles.buttonGitHub}
            type="button"
            onClick={() => signIn("github")}
          >
            <BsGithub /> Entre com o Github
          </button>
          <button
            className={styles.buttonGoogle}
            type="button"
            onClick={() => signIn("google")}
          >
            <FcGoogle /> Entre com o Google
          </button>
        </div>
        <div className={styles.notHaveAccount}>
          <p>
            Não possui uma conta? &nbsp;
            <Link className={styles.linkRegister} href="/Register">
              CADASTRE-SE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    console.log("mandou para o perfil");
    return {
      redirect: {
        destination: "/Perfil",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

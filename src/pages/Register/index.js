import styles from "../../styles/Register.module.css";
import Link from "next/link";
import validator from "validator";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import bcrypt from "bcryptjs";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (body) => {
    try {
      const nBody = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: bcrypt.hashSync(body.password, 10),
      };
      const response = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify(nBody),
      });

      console.log(response, "response");

      const json = await response.json();
      if (response.status !== 200) throw new Error(json);
      setCookie("authorization", json);
      router.push("/Login");
    } catch (error) {
      setError(error.message);
    }
  };

  const watchPassword = watch("password");

  return (
    <div className={styles.main}>
      <div className={styles.form_container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Crie sua conta</h1>
          <div className={styles.input_group}>
            <div className={styles.name_group}>
              <div className={styles.input_box}>
                <label htmlFor="firstName">Primeiro nome</label>
                <input
                  className={errors?.firstName && styles.input_error}
                  id="firstName"
                  type="text"
                  {...register("firstName", { required: true })}
                />
                {errors?.firstName?.type === "required" && (
                  <p className={styles.error_message}>
                    O primeiro nome é obrigatório.
                  </p>
                )}
              </div>

              <div className={styles.input_box}>
                <label htmlFor="lastName">Ultimo nome</label>
                <input
                  className={errors?.lastName && styles.input_error}
                  id="lastName"
                  type="text"
                  {...register("lastName", { required: true })}
                />
                {errors?.lastName?.type === "required" && (
                  <p className={styles.error_message}>
                    O ultimo nome é obrigatório.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.input_box}>
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
                <p className={styles.error_message}>O e-mail é obrigatório.</p>
              )}
              {errors?.email?.type === "validate" && (
                <p className={styles.error_message}>
                  O e-mail é inválido. Formato esperado: exemplo@exemplo.com
                </p>
              )}
              {error && (
                <p className={styles.error_registered_email}>{error}</p>
              )}
            </div>

            <div className={styles.input_box}>
              <label htmlFor="phone">Telefone</label>
              <input
                className={errors?.phone && styles.input_error}
                id="phone"
                type="tel"
                {...register("phone", {
                  required: true,
                  validate: (value) => validator.isMobilePhone(value, "pt-BR"),
                })}
              />
              {errors?.phone?.type === "required" && (
                <p className={styles.error_message}>
                  O telefone é obrigatório.
                </p>
              )}
              {errors?.phone?.type === "validate" && (
                <p className={styles.error_message}>
                  O telefone é inválido. Formato esperado (99) 9999-9999
                </p>
              )}
            </div>

            <div className={styles.password_group}>
              <div className={styles.input_box}>
                <label htmlFor="password">Senha</label>
                <input
                  className={errors?.password && styles.input_error}
                  id="password"
                  type="password"
                  {...register("password", {
                    required: true,
                    minLength: 8,
                  })}
                />
                {errors?.password?.type === "required" && (
                  <p className={styles.error_message}>A senha é obrigatória.</p>
                )}
                {errors?.password?.type === "minLength" && (
                  <p className={styles.error_message}>
                    A senha deve ter no mínimo 8 caracteres
                  </p>
                )}
              </div>

              <div className={styles.input_box}>
                <label htmlFor="confirmPassword">Confirme sua senha</label>
                <input
                  className={errors?.confirmPassword && styles.input_error}
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => value === watchPassword,
                  })}
                />
                {errors?.confirmPassword?.type === "required" && (
                  <p className={styles.error_message}>
                    A confirmação da senha é obrigatória.
                  </p>
                )}
                {errors?.confirmPassword?.type === "validate" && (
                  <p className={styles.error_message}>
                    As senhas devem ser iguais.
                  </p>
                )}
              </div>
            </div>
          </div>
          <button type="submit">Cadastrar</button>
        </form>
        <div className={styles.haveAccount}>
          <p>
            Já possui uma conta? &nbsp;
            <Link className={styles.linkLogin} href="/Login">
              LOGIN
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.img_container}></div>
    </div>
  );
}

import styles from "../../styles/Login.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { get, set, useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
export default function RegisterAdress() {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [habilitar, setHabilitar] = useState(false);
  const [displayValue, setDisplayValue] = useState("none");
  
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm();

  const onSubmit = async (body) => {
    try {
      await fetch("/api/user/registerAddress", {
        method: "POST",
        body: JSON.stringify({
          userEmail: session.user.email,
          cep: body.cep.replace(/\D/g, ""),
          logradouro: body.logradouro,
          numero: body.numero,
          bairro: body.bairro,
          complemento: body.complemento,
          cidade: body.cidade,
          estado: body.estado,
        }),
      });
    } catch (error) {
      console.error("Erro no cadastro do usuario: ", error);
    }
  };

  const checkCEP = (event) => {
    const cep = event.target.value.replace(/\D/g, "");

    try {
      if (cep === "") {
        return;
      }
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          setValue("cep", cep);
          setValue("logradouro", data.logradouro);
          setValue("bairro", data.bairro);
          setValue("cidade", data.localidade);
          setValue("estado", data.uf);
          setFocus("numero");
        });
    } catch (error) {
      setError("CEP não encontrado.");
    }
  };


  useEffect(() => {
    async function getAddress(){
      try {
        const address=await axios.get("/api/user/checkAddress",{
          params:{
            email:session.user?.email
          }
        }).then((res)=>res.data)
      if(address){
          setValue("cep", address[0].cep);
          setValue("logradouro", address[0].logradouro);
          setValue("bairro", address[0].bairro);
          setValue("complemento", address[0].complemento);
          setValue("cidade", address[0].cidade);
          setValue("estado", address[0].estado);
          setValue("numero", address[0].numero);
          setHabilitar(true)
          setDisplayValue("block")
        return address;
      }else{
        setDisplayValue("none")
        setHabilitar(false)
      }
      } catch (error) {
        console.error(error)
      }
    }

    getAddress()
  }, []);

  const handleHabilitar=()=>{
    setHabilitar(!habilitar)
  }
  return (
    <section className={styles.container + " " + styles.forms}>
      <div className={styles.form + " " + styles.login}>
        <div className={styles.form_content}>
          <header>Cadastre seu endereço</header>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.formClass}>
            <div className={styles.field + " " + styles.input_field}>
              <input disabled={habilitar}
                className={
                  errors?.cep && styles.input_error + " " + styles.input 
                }
                id="cep"
                placeholder="CEP"
                type="text"
                {...register("cep", { required: true })}
                onBlur={checkCEP}
                
              />
              {errors?.cep?.type === "required" && (
                <span className={styles.error_message}>
                  O CEP é obrigatório.
                </span>
              )}
              {error && <span>{error}</span>}
            </div>

            <div className={styles.field + " " + styles.input_field}>
              <input disabled={habilitar}
                className={
                  errors?.logradouro && styles.input_error + " " + styles.input
                }
                id="logradouro"
                placeholder="Logradouro"
                type="text"
                {...register("logradouro", { required: true })}
              />
              {errors?.logradouro?.type === "required" && (
                <span className={styles.error_message}>
                  O logradouro é obrigatório.
                </span>
              )}
            </div>

            <div className={styles.group_number_neighborhood}>
              <div className={styles.field + " " + styles.input_field}>
                <input disabled={habilitar}
                  className={
                    errors?.numero && styles.input_error + " " + styles.input
                  }
                  id="numero"
                  placeholder="Número"
                  type="number"
                  {...register("numero", { required: true })}
                />
                {errors?.numero?.type === "required" && (
                  <span className={styles.error_message}>
                    O número é obrigatório.
                  </span>
                )}
              </div>

              <div className={styles.field + " " + styles.input_field}>
                <input disabled={habilitar}
                  className={
                    errors?.bairro && styles.input_error + " " + styles.input
                  }
                  id="bairro"
                  placeholder="Bairro"
                  type="text"
                  {...register("bairro", { required: true })}
                />
                {errors?.bairro?.type === "required" && (
                  <span className={styles.error_message}>
                    O bairro é obrigatório.
                  </span>
                )}
              </div>
            </div>

            <div className={styles.field + " " + styles.input_field}>
              <input disabled={habilitar}
                id="complemento"
                placeholder="Complemento"
                className={styles.input}
                type="text"
                {...register("complemento")}
              />
            </div>

            <div className={styles.group_city_uf}>
              <div className={styles.field + " " + styles.input_field}>
                <input disabled={habilitar}
                  className={
                    errors?.cidade && styles.input_error + " " + styles.input
                  }
                  id="cidade"
                  placeholder="Cidade"
                  type="text"
                  {...register("cidade", { required: true })}
                />
                {errors?.cidade?.type === "required" && (
                  <span className={styles.error_message}>
                    A cidade é obrigatória.
                  </span>
                )}
              </div>

              <div className={styles.field + " " + styles.input_field}>
                <input disabled={habilitar}
                  className={
                    errors?.estado && styles.input_error + " " + styles.input
                  }
                  id="estado"
                  placeholder="Estado"
                  type="text"
                  {...register("estado", { required: true })}
                />
                {errors?.estado?.type === "required" && (
                  <span className={styles.error_message}>
                    O estado é obrigatório.
                  </span>
                )}
              </div>
            </div>

            <div className={styles.field + " " + styles.button_field}> 
              <button type="submit" disabled={habilitar}>CADASTRAR</button>
            </div>
          </form>
            <div className={styles.field + " " + styles.button_field}> 
              <button disabled={habilitar} style={{ display: displayValue }} onClick={handleHabilitar}>EDITAR</button>
            </div>
        </div>
      </div>
    </section>
  );
}

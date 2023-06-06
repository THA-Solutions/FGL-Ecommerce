import axios from "axios";
import styles from "../../styles/Checkout.module.css";

import { getSession } from "next-auth/react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import UInumber from "@/UI/UInumber";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Checkout() {
  const [session, setSession] = useState();
  const [address, setAddress] = useState([]);
  const [updateInfo, setUpdateInfo] = useState(true);
  const [error, setError] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [itemCart, setItemCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm();

  useLayoutEffect(() => {
    async function getSessionUser() {
      const session = await getSession();
      setSession(session);
      return session;
    }
    getSessionUser();
  }, []);

  useEffect(() => {
    async function getAddress() {
      const session = await getSession();
      const address = await axios.get(`/api/user/checkAddress`, {
        params: { email: session.user.email },
      });
      setAddress(address.data);
      return address;
    }
    getAddress();

    async function getCartItems() {
      const session = await getSession();
      const produto = await axios.get(`/api/cart/getCart`, {
        params: { email: session.user.email },
      });
      setItemCart(produto.data.carts);
      setTotal(produto.data.total);
      return produto;
    }
    getCartItems();
  }, []);

  const onSubmit = async (body) => {
    setEditAddress(false);
    setUpdateInfo(true);
    const session = await getSession();
    try {
      await fetch("/api/user/updateAddress", {
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
      console.error("Erro na atualização do endereço: ", error);
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

  const sendEmail = async () => {
    const result = await axios.post(`/api/email/sendEmail`, {
      itemCart: itemCart,
      total: total,
      session: session,
      address: address,
    });
    await axios.post(`/api/cart/closeCart`, {
      email: session.user.email,
    });
    router.push("/Finish");
    return result;
  };

  function subCaract(texto) {
    const caracteresEspeciais = /[!@#$%&*()+=[\]{}|\\/<>,.?:;]/g;
    return texto.replace(caracteresEspeciais, "-");
  }

  return (
    <div className={styles.container_checkout}>
      {/* Dados usuário */}
      <section className={styles.container + " " + styles.forms}>
        <div className={styles.form + " " + styles.login}>
          <div className={styles.form_content}>
            <header>Confirme seus dados</header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.formClass}
            >
              <div className={styles.field + " " + styles.input_field}>
                <label>Nome</label>
                <input
                  className={styles.input}
                  placeholder={session?.user?.name}
                  type="text"
                  disabled={true}
                />
              </div>
              <div className={styles.field + " " + styles.input_field}>
                <label>E-mail</label>
                <input
                  className={styles.input}
                  placeholder={session?.user?.email}
                  type="text"
                  disabled={true}
                />
              </div>
              <div className={styles.field + " " + styles.input_field}>
                <label>Telefone</label>
                <input
                  className={styles.input}
                  placeholder={session?.user?.phone}
                  type="text"
                  disabled={true}
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Dados de entrega */}
      <section className={styles.container + " " + styles.forms}>
        <div className={styles.form + " " + styles.login}>
          <div className={styles.form_content}>
            <header>Confirme seu endereço</header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.formClass}
            >
              <div className={styles.field + " " + styles.input_field}>
                <input
                  className={styles.input}
                  id="cep"
                  placeholder={address[0]?.cep || "CEP"}
                  type="text"
                  {...register("cep", { required: true })}
                  onBlur={checkCEP}
                  disabled={updateInfo}
                />
                {errors?.cep?.type === "required" && (
                  <span className={styles.error_message}>
                    O CEP é obrigatório.
                  </span>
                )}
                {error && <span>{error}</span>}
              </div>
              <div className={styles.field + " " + styles.input_field}>
                <input
                  className={styles.input}
                  id="logradouro"
                  placeholder={address[0]?.logradouro || "Logradouro"}
                  type="text"
                  {...register("logradouro", { required: true })}
                  disabled={updateInfo}
                />
                {errors?.logradouro?.type === "required" && (
                  <span className={styles.error_message}>
                    O logradouro é obrigatório.
                  </span>
                )}
              </div>
              <div className={styles.group_number_neighborhood}>
                <div className={styles.field + " " + styles.input_field}>
                  <input
                    className={styles.input}
                    id="numero"
                    placeholder={address[0]?.numero || "Número"}
                    type="number"
                    {...register("numero", { required: true })}
                    disabled={updateInfo}
                  />
                  {errors?.numero?.type === "required" && (
                    <span className={styles.error_message}>
                      O número é obrigatório.
                    </span>
                  )}
                </div>
                <div className={styles.field + " " + styles.input_field}>
                  <input
                    className={styles.input}
                    id="bairro"
                    placeholder={address[0]?.bairro || "Bairro"}
                    type="text"
                    {...register("bairro", { required: true })}
                    disabled={updateInfo}
                  />
                  {errors?.bairro?.type === "required" && (
                    <span className={styles.error_message}>
                      O bairro é obrigatório.
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.field + " " + styles.input_field}>
                <input
                  id="complemento"
                  placeholder={address[0]?.complemento || "Complemento"}
                  className={styles.input}
                  type="text"
                  {...register("complemento")}
                  disabled={updateInfo}
                />
              </div>
              <div className={styles.group_city_uf}>
                <div className={styles.field + " " + styles.input_field}>
                  <input
                    className={styles.input}
                    id="cidade"
                    placeholder={address[0]?.cidade || "Cidade"}
                    type="text"
                    {...register("cidade", { required: true })}
                    disabled={updateInfo}
                  />
                  {errors?.cidade?.type === "required" && (
                    <span className={styles.error_message}>
                      A cidade é obrigatória.
                    </span>
                  )}
                </div>

                <div className={styles.field + " " + styles.input_field}>
                  <input
                    className={styles.input}
                    id="estado"
                    placeholder={address[0]?.estado || "Estado"}
                    type="text"
                    {...register("estado", { required: true })}
                    disabled={updateInfo}
                  />
                  {errors?.estado?.type === "required" && (
                    <span className={styles.error_message}>
                      O estado é obrigatório.
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.field + " " + styles.button_field}>
                {editAddress ? (
                  <button type="submit" className={styles.button_submit}>
                    SALVAR
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setUpdateInfo(false);
                      setEditAddress(true);
                    }}
                  >
                    EDITAR
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Dados da compra */}
      <section className={styles.container + " " + styles.forms}>
        <div className={styles.form + " " + styles.login}>
          <div className={styles.form_content_product}>
            <header>Confirme seus produtos</header>
            {itemCart.map((item, index) => (
              <div className={styles.product_content} key={index}>
                <Image
                  width={100}
                  height={100}
                  src={`/${item.produto.marca_produto}/${subCaract(
                    item.produto.modelo
                  )}.${"png" || "jpg" || "jpeg" || "gif" || "svg" || "webp"}`}
                  /*{item.img}*/
                  alt=""
                  className={styles.product_img}
                />
                <h3>{item.titulo_produto}</h3>
                <p>Quantidade: {item.quantidade}</p>
                <p>
                  Valor: <UInumber>{item.total}</UInumber>
                </p>
              </div>
            ))}
          </div>
          <p className={styles.total_products}>
            Total da compra: <UInumber>{total}</UInumber>
          </p>
          <button className={styles.finish_button} onClick={() => sendEmail()}>
            FINALIZAR COMPRA
          </button>
        </div>
      </section>
    </div>
  );
}

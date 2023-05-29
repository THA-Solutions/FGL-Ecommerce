import styles from "../../styles/Cart.module.css";
import axios from "axios";
import Link from "next/link";

import UInumber from "@/UI/UInumber";
import ItemCart from "../../components/ItemCart";

import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Cart() {
  const [itemCart, setItemCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [refreshCart, setRefreshCart] = useState(false);
  const [currentSession, setSession] = useState({ email: null });
  const { data: session } = useSession();

  useEffect(() => {
    try {
      function getSession() {
        if (session) {
          setSession(session);
        }
      }
      getSession();
      async function getCartItems() {
        const produto = await axios.get(`/api/cart/getCart`, {
          params: { email: session.user.email },
        });
        setItemCart(produto.data.carts);
        setTotal(produto.data.total);
        setRefreshCart(false);
        return produto;
      }
      getCartItems();
    } catch (error) {
      console.error(error);
    }
  }, [refreshCart]);

  async function handleQuantity(event, titulo) {
    if (event === "increase") {
      const result = await axios.post(`/api/cart/handleQuantity`, {
        titulo_produto: titulo,
        acao: event,
        cartId: itemCart[0].id_pedido,
        itemCart: itemCart,
      });
      setRefreshCart(!refreshCart);
      return result;
    } else {
      const result = await axios.post(`/api/cart/handleQuantity`, {
        titulo_produto: titulo,
        acao: event,
        cartId: itemCart[0].id_pedido,
        itemCart: itemCart,
      });
      setRefreshCart(!refreshCart);
      return result;
    }
  }

  const handleRemoveFromCart = async (id) => {
    const result = await axios.post(`/api/cart/deleteItem`, {
      id: id,
    });
    setRefreshCart(!refreshCart);
    return result;
  };

  const handleRemoveAllItems = async () => {
    const result = await axios.post(`/api/cart/deleteItem`, {
      itemCart: itemCart,
      acao: "deleteAll",
    });
    setRefreshCart(!refreshCart);
    return result;
  };

  const sendEmail = async () => {
    const result = await axios.post(`/api/email/sendEmail`, {
      itemCart: itemCart,
      total: total,
    });
    return result;
  };

  return (
    <>
      <div className={styles.cart}>
        <div className={styles.container_left}>
          <div className={styles.container_top_buttons}>
            <Link className={styles.link_product_list} href="/">
              <FaArrowLeft /> Continue comprando
            </Link>
            <button
              className={styles.button_remove_all}
              onClick={() => handleRemoveAllItems()}
            >
              Remover tudo <FaTrashAlt />
            </button>
          </div>
          <hr />
          <div className={styles.product_list_cart}>
            <ItemCart
              cart={itemCart}
              updateQuantity={{ handleQuantity }}
              removeFromCart={{ handleRemoveFromCart }}
            />
          </div>
          <hr />
          <div className={styles.calculate_freight}>
            <h3>Calcule o frete</h3>
            <form action="/calcular-frete">
              <input type="number" placeholder="Digite seu CEP" name="cep" />
              <button type="subimit"> Calcular </button>
            </form>
            <Link
              className={styles.calculate_freight_link}
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
            >
              Não sei meu CEP
            </Link>
          </div>
        </div>
        <div className={styles.container_right}>
          <div className={styles.summary}>
            <h1>Resumo da compra</h1>
            <div className={styles.summary_total}>
              <h4>Valor dos produtos :</h4>
              <h3>
                <UInumber>{`${total}`}</UInumber>
              </h3>
            </div>
            <div className={styles.summary_shipping}>
              <h4>Frete: </h4>
              <h3>
                <UInumber>0</UInumber>
              </h3>
            </div>
            <div className={styles.summary_total_term}>
              <h4>Total à prazo: </h4>
              <h3>
                <UInumber>{`${total}`}</UInumber>
              </h3>
            </div>
            <h5>
              (em até 10x de <UInumber>{`${total / 10}`}</UInumber>)
            </h5>
            <div className={styles.summary_total_pix}>
              <h4>Total à vista no Pix: </h4>
              <h3>
                <UInumber>{`${total}`}</UInumber>
              </h3>
              <h4>
                (economia de <UInumber>0</UInumber>)
              </h4>
            </div>
          </div>
          <Link
            href="/Register/address"
            onClick={() => {
              //sendEmail();
              const teste = "seila";
              return teste;
            }}
          >
            <button> FINALIZAR COMPRA </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/Login",
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
import styles from "../styles/Products.module.css";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import CarouselComponent from "./Carousel";
import UInumber from "@/UI/UInumber";
import Filters from "./Filters";
import PopUp from "./PopUp";
import { useContext, useState, useEffect } from "react";
import { BsCartFill } from "react-icons/bs";
import { useSession, getSession } from "next-auth/react";
import { SearchContext } from "../context/SearchContext";
import { FilterContext } from "@/context/FilterContext";
import imagem from "../../public/growatt/57566-9.png";
//import fs from 'fs';
//import path from 'path';

export default function Products() {
  const { data: session, status } = useSession();
  const { dadosFiltrados } = useContext(FilterContext);
  const { search } = useContext(SearchContext);
  const [produtosNoBancoDeDados, setProdutosNoBancoDeDados] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [currentSession, setSession] = useState({ email: null });
  const [showPopUp, setShowPopUp] = useState(false);
  const [imagePaths, setImagePaths] = useState([]);

  function subCaract(texto) {
    const caracteresEspeciais = /[!@#$%&*()+=[\]{}|\\/<>,.?:;]/g;
    return texto.replace(caracteresEspeciais, '-');
  }


  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/product/getProductList"
        );
        const listaProdutosTratada = response.data.map((product) => {
          return {
            id: product.id_produto,
            titulo: product.titulo,
            preco: product.preco,
            marca: product.marca,
            modelo: product.modelo,
            potencia_modulo: product.potencia_modulo,
            potencia_saida: product.potencia_saida,
            quantidade_mppt: product.quantidade_mppt,
            tensao_saida: product.tensao_saida,
            
          };
        });
        
        setProdutosNoBancoDeDados(listaProdutosTratada);
        console.log("listaProdutosTratada: ", listaProdutosTratada);
      } catch (error) {
        console.error("Erro ao carregar a pagina de produtos", error);
      }
    }
    fetchData();
  }, [session]);





  const handleAddToCart = async (id) => {
    if (session) {
      const produto = await axios
        .get(`http://localhost:3000/api/product/getProductByID`, {
          params: {
            id: id,
          },
        })
        .then((response) => response.data);
      const alreadyInCart = shoppingCart.find((item) => item.id === id);
      if (alreadyInCart) {
        const newShoppingCart = shoppingCart.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantidade: item.quantidade + 1,
              total: item.preco * (item.quantidade + 1),
            };
          }
          return item;
        });
        setShoppingCart(() => newShoppingCart);
        await addCartItem(newShoppingCart);
      } else {
        const newCartItem = [
          {
            titulo: produto.titulo_produto,
            id: produto.id_produto,
            preco: produto.preco,
            quantidade: 1,
            total: produto.preco,
          },
        ];
        setShoppingCart(() => newCartItem);
        await addCartItem(newCartItem);
      }
    } else {
      alert("Faça login para adicionar ao carrinho");
    }
  };

  async function addCartItem(item) {
    const addCartItem = await axios.post(
      "http://localhost:3000/api/cart/addItem",
      {
        shoppingCart: item,
        totalValue: getCartValue(),
        email: session.user.email,
      }
    );
    return addCartItem.data;
  }

  const productsList = produtosNoBancoDeDados.filter((product) =>
    product.titulo.toLocaleLowerCase().includes(search.toLowerCase())
  );

  const getCartValue = () => {
    const total = 1;
    return total;
  };

  const produtosFiltradosPelaSearchBar = dadosFiltrados.filter((product) =>
    product.titulo.toLocaleLowerCase().includes(search.toLowerCase())
  );

  let produtos = [];

  if (produtosFiltradosPelaSearchBar.length === 0) {
    produtos = produtosNoBancoDeDados;
  } else {
    produtos = produtosFiltradosPelaSearchBar;
  }

  return (
    <>
      <div className={styles.container_carousel}>
        <CarouselComponent />
      </div>
      <div className={styles.article}>
        <div className={styles.container_filters}>
          <Filters data={produtosNoBancoDeDados} />
        </div>
        <section className={styles.container}>
          <h2 className={styles.title}>PRODUTOS</h2>
          <div className={styles.shop_content}>
            {/* lista de produtos */}
            {produtos.length === 0 && (
              <div className={styles.no_products}>
                <h2>Nenhum produto encontrado</h2>
              </div>
            )}
            {produtos.map((product) => (
              <div className={styles.product_box} key={product.id}>
                <Link className={styles.link_product} href={`/${product.id}`}>
                  <Image
                    width={220}
                    height={380}
                    src={`/${product.marca}/${subCaract(product.modelo)}.png`}
                    alt=""
                    className={styles.product_img + " " + styles.img}
                  />
                  <h2 className={styles.product_title}>{product.titulo}</h2>
                </Link>

                <UInumber classNameProp={styles.price}>
                  {product.preco}
                </UInumber>
                <i
                  className={styles.add_cart}
                  onClick={() => {
                    handleAddToCart(product.id);
                    setShowPopUp(true);
                  }}
                >
                  <BsCartFill />
                </i>
              </div>
            ))}
          </div>
        </section>
      </div>
      {session ? (
        <PopUp trigger={showPopUp} setTrigger={setShowPopUp}>
          <h3>Produto adicionado ao carrinho!</h3>
        </PopUp>
      ) : (
        <PopUp trigger={showPopUp} setTrigger={setShowPopUp}>
          <h3>
            Faça <Link href="Login">LOGIN</Link> para adicionar produtos ao
            carrinho.
          </h3>
        </PopUp>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

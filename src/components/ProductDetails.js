import { getSession } from "next-auth/react";
import styles from "../styles/ProductDetails.module.css";
import { useState } from "react";
import axios from "axios";

export default function ProductDetails(props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

function subCaract(texto) {
  const caracteresEspeciais = /[!@#$%&*()+=[\]{}|\\/<>,.?:;]/g;
  return texto.replace(caracteresEspeciais, '-');
}

const images = [
  `/${props.produto.marca}/${subCaract(props.produto.modelo)}.${"png"||"jpg"||"jpeg"||"gif"||"svg"||"webp"}`,
];


const handleAddToCart = async (id) => {
  const session = await getSession();
  if (session) {
    const {carts} = await axios.get(`/api/cart/getCart`, {
      params: { email: session.user.email },
    }).then((res) => { return res.data; });


  const alreadyInCart = carts.find((item) => item.id_produto === id);


  if (alreadyInCart) {
    const produto = await axios
    .get(`/api/product/getProductByID`, {
      params: {
        id: id,
      },
    }).then((response) => response.data);
          const newCartItem = [{
            titulo:produto.titulo_produto,
            id: produto.id_produto,
            preco: produto.preco,
            quantidade: 1,
            total: produto.preco,
        }]


    await addCartItem(newCartItem);
    return;
  }else{

    const produto = await axios
    .get(`/api/product/getProductByID`, {
      params: {
        id: id,
      },
    })
    .then((response) => response.data);

  
    const newCartItem = [{
      titulo:produto.titulo_produto,
      id: produto.id_produto,
      preco: produto.preco,
      quantidade: 1,
      total: produto.preco,
  }]
  console.log(newCartItem, "newCartItem")
  await addCartItem(newCartItem);
  }}}

async function addCartItem(item) {
  const session = await getSession();
  const addCartItem = await axios.post(
    "/api/cart/addItem",
    {
      shoppingCart: item,
      email: session.user.email,
    }
  );
  return addCartItem.data;
}
  
  return (
    <>
      <section className={styles.section}>
        <div className={styles.image_container}>
          <div className={styles.outFocus_product_images}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${selectedImage === index ? styles.selected : ""}`}
                onClick={() => handleImageClick(index)}
              >
                <img src={image} alt={`thumbnail ${index}`} />
              </div>
            ))}
          </div>
          <div className={styles.selected_image}>
            <img src={images[selectedImage]} alt="selected" />
          </div>
        </div>

        <div className={styles.product_description_container}>
          <h1>DESCRIÇÃO</h1>
          <hr />
          <h4>Modelo: {props.produto.modelo}</h4>
          <p>{props.produto.descricao}</p>
        </div>

        <div className={styles.checkout_container}>
          <div className={styles.product_title}>
            <h1>{props.produto.titulo}</h1>
            <h3>Marca: {props.marca}</h3>
          </div>
          <div className={styles.product_price}>
            <h2>R$ {props.produto.preco}</h2>
            <h3>(Em até 10x de R$ {props.produto.preco / 10})</h3>
          </div>
          <div className={styles.calculate_freight}>
            <h2>Calcule o frete</h2>
            <form action="">
              <input
                type="text"
                placeholder="Informe seu CEP"
                name="search"
              />
              <button type="submit">Calcular</button>
            </form>
          </div>
          {props.produto.quantidade > 0 ? (
            <h2>Estoque disponível</h2>
          ) : (
            <h2>Estoque indisponível</h2>
          )}
          <div className={styles.checkout_buttons}>
            <button className={styles.buy}>Comprar</button>
            <button className={styles.add_cart} onClick={() => { handleAddToCart(props.produto.id)}}>Adicionar ao carrinho</button>
          </div>
        </div>
      </section>
    </>
  );
}

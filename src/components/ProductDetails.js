import styles from "../styles/ProductDetails.module.css";
import { useState } from "react";

export default function ProductDetails(props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const images = [
    //thumbnails
    "https://source.unsplash.com/random/500x500/?night",
    "https://source.unsplash.com/random/500x500/?animal",
    "https://source.unsplash.com/random/500x500/?space",
    "https://source.unsplash.com/random/500x500/?pokemon",
    "https://source.unsplash.com/random/500x500/?naruto",
    "https://source.unsplash.com/random/500x500/?crazy",
  ];

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
            <h1>{props.produto.titulo_produto}</h1>
            <h3>Marca: {props.produto.marca_produto}</h3>
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
            <button className={styles.add_cart}>Adicionar ao carrinho</button>
          </div>
        </div>
      </section>
    </>
  );
}

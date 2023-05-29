import styles from "../styles/Filters.module.css";
import { FilterContext } from "@/context/FilterContext";
import { useContext } from "react";

export default function Filters(props) {
  const { handleOnCheckbox, setProdutos } = useContext(FilterContext);
  const produtos = props.data;

  setProdutos(props.data);

  const sortValues = (values) => {
    return values.sort((a, b) => {
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b, undefined, { numeric: true });
      } else {
        return a - b;
      }
    });
  };

  return (
    <>
      <h2 className={styles.filter_title}>FILTROS</h2>

      {/* Marcas */}
      <div className={styles.filter_category}>
        <h4 className={styles.filter_category_name}>Marca</h4>

        {sortValues(
          produtos.reduce((acc, item) => {
            if (!acc.includes(item.marca)) {
              acc.push(item.marca);
            }
            return acc;
          }, [])
        ).map((marca) => {
          return (
            <div className={styles.link} key={marca}>
              <input
                onChange={handleOnCheckbox}
                className={styles.filter_checkbox}
                type="checkbox"
                name="marca"
                id={marca}
                value={marca}
              />
              <label className={styles.filter_subcategory} htmlFor={marca}>
                {marca}
              </label>
            </div>
          );
        })}
      </div>

      {/* Potencia do Modulo */}
      <div className={styles.filter_category}>
        <h4 className={styles.filter_category_name}>Potencia do Modulo</h4>
        {sortValues(
          produtos.reduce((acc, item) => {
            if (
              !acc.includes(item.potencia_modulo) &&
              item.potencia_modulo !== null
            ) {
              acc.push(item.potencia_modulo);
            }
            return acc;
          }, [])
        ).map((potencia_modulo) => {
          return (
            <div className={styles.link} key={potencia_modulo}>
              <input
                onChange={handleOnCheckbox}
                className={styles.filter_checkbox}
                type="checkbox"
                name="potencia_modulo"
                id={potencia_modulo}
                value={potencia_modulo}
              />
              <label
                className={styles.filter_subcategory}
                htmlFor={potencia_modulo}
              >
                {potencia_modulo}
              </label>
            </div>
          );
        })}
      </div>

      {/* Tensao de Saida */}
      <div className={styles.filter_category}>
        <h4 className={styles.filter_category_name}>Tensao de Saida</h4>
        {sortValues(
          produtos.reduce((acc, item) => {
            if (!acc.includes(item.tensao_saida) && item.tensao_saida !== null) {
              acc.push(item.tensao_saida);
            }
            return acc;
          }, [])
        ).map((tensao_saida) => {
          return (
            <div className={styles.link} key={tensao_saida}>
              <input
                onChange={handleOnCheckbox}
                className={styles.filter_checkbox}
                type="checkbox"
                name="tensao_saida"
                id={tensao_saida}
                value={tensao_saida}
              />
              <label
                className={styles.filter_subcategory}
                htmlFor={tensao_saida}
              >
                {tensao_saida}
              </label>
            </div>
          );
        })}
      </div>

      {/* Quantidade de MPPTs */}
      <div className={styles.filter_category}>
        <h4 className={styles.filter_category_name}>Quantidade de MPPTs</h4>
        {sortValues(
          produtos.reduce((acc, item) => {
            if (
              !acc.includes(item.quantidade_mppt) &&
              item.quantidade_mppt !== null
            ) {
              acc.push(Number(item.quantidade_mppt));
            }
            return acc;
          }, [])
        ).map((quantidade_mppt) => {
          return (
            <div className={styles.link} key={Number(quantidade_mppt)}>
              <input
                onChange={handleOnCheckbox}
                className={styles.filter_checkbox}
                type="checkbox"
                name="quantidade_mppt"
                id={Number(quantidade_mppt)}
                value={Number(quantidade_mppt)}
              />
              <label
                className={styles.filter_subcategory}
                htmlFor={Number(quantidade_mppt)}
              >
                {Number(quantidade_mppt)}
              </label>
            </div>
          );
          
        })}
      </div>

      {/* Potencia de Saida */}
      <div className={styles.filter_category}>
        <h4 className={styles.filter_category_name}>Potencia de Saida</h4>
        {sortValues(
          produtos.reduce((acc, item) => {
            if (!acc.includes(item.potencia_saida) && item.potencia_saida !== null) {
              acc.push(item.potencia_saida);
            }
            return acc;
          }, [])
        ).map((potencia_saida) => {
          return (
            <div className={styles.link} key={potencia_saida}>
              <input
                onChange={handleOnCheckbox}
                className={styles.filter_checkbox}
                type="checkbox"
                name="potencia_saida"
                id={potencia_saida}
                value={potencia_saida}
              />
              <label
                className={styles.filter_subcategory}
                htmlFor={potencia_saida}
              >
                {potencia_saida}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
}

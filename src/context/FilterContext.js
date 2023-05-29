import { createContext, useState } from "react";
export const FilterContext = createContext();
export const FilterProvider = ({ children }) => {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState({});

  const handleOnCheckbox = (event) => {
    const filterParam = event.target.name;
    console.log(filterParam);
    setMarcasSelecionadas({
      ...marcasSelecionadas,
      [event.target.value]: event.target.checked,
    });
    if (event.target.checked) {
      //const campoFiltrado = listaProdutos.filter(
      //  (item) => item.marca === event.target.value
      //);
      const campoFiltrado = listaProdutos.filter((item) => {
        let value;
        if (event.target.value !== null) {
          value =
            filterParam === "quantidade_mppt"
              ? Number(event.target.value)
              : event.target.value;
          return item[filterParam] === value;
        }
      });
      setDadosFiltrados([...dadosFiltrados, ...campoFiltrado]);
      console.log(campoFiltrado, "campo filtrado");
    } else {
      const campoFiltrado = dadosFiltrados.filter((item) => {
        let value;
        if (event.target.value !== null) {
          value =
            filterParam === "quantidade_mppt"
              ? Number(event.target.value)
              : event.target.value;
          return item[filterParam] !== value;
        }
      });
      setDadosFiltrados([...campoFiltrado]);
      console.log(campoFiltrado, "campo nao filtrado");
    }
  };

  const setProdutos = (data) => {
    setListaProdutos(data);
  };
  return (
    <FilterContext.Provider
      value={{ dadosFiltrados, handleOnCheckbox, setProdutos }}
    >
      {children}
    </FilterContext.Provider>
  );
};
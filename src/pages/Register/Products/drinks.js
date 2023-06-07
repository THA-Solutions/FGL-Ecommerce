import styles from "../../../styles/Drinks.module.css";
import RegisterFormProducts from "../../../components/RegisterFormProducts";
import { useForm } from "react-hook-form";

export default function RegisterDrinks() {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm();

  const onSubmit = async (body) => {
    console.log(body);

    try {
      // cadastro no banco
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.container}>
      <RegisterFormProducts />
    </section>
  );
}

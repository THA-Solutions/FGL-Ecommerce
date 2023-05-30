import styles from "../../styles/Perfil.module.css";
import Image from "next/image";
import perfilImagemAlternative from "../../../public/fgl_quadrado.png";
import { getSession, signOut, useSession } from "next-auth/react";

export default function Perfil() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className={styles.container}>
      <h1>Perfil</h1>

      <Image
        className={styles.image}
        width={100}
        height={100}
        src={session?.user?.image || perfilImagemAlternative}
        alt="Imagem de perfil"
      />

      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      <p>Endereço</p>
      <p>Telefone</p>

      <button onClick={() => signOut()}>Logout</button>
    </div>
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

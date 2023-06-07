import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  function setValueHandler(value) {
    localStorage.setItem("value", value);

    router.push("/Products");
  }

  return (
    <div>
      <button
        onClick={() => {
          setValueHandler("bebida");
        }}
      >
        Bebidas
      </button>
      <button
        onClick={() => {
          setValueHandler("solar");
        }}
      >
        Solar
      </button>
    </div>
  );
}

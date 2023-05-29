import ProductDetails from "@/components/ProductDetails";
import Comments from "@/components/Comments";
import axios from "axios";

export async function getServerSideProps(context) {
  const { params } = context;
  const id = params.id_produto;
  const productData = await axios.get(
    `http://localhost:3000/api/product/getProductByID`,
    {
      params: {
        id: id,
      },
    }
  );
  const comments = await axios.get(
    "http://localhost:3000/api/comments/getComments",
    {
      params: {
        id: id,
      },
    }
  );
  const findedComments = comments.data.comment;
  const comment = findedComments.map((comment) => {
    return {
      descricao: comment.descricao,
      data_lancamento: comment.data_lancamento.substring(0, 10),
    };
  });

  return {
    props: {
      produto: productData.data,
      comment: comment,
      id: id,
    },
  };
}

export default function produto({ produto, comment, id }) {
  return (
    <div>
      <ProductDetails produto={produto} />
      <Comments comment={comment} id={id} />
    </div>
  );
}

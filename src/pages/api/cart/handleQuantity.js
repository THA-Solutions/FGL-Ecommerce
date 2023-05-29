import db from "../../../lib/db";

export default async function remCartItem(req, res) {
  try {
    const { titulo_produto, acao, cartId } = req.body;
    const [item] =
      await db.$queryRaw`SELECT IC.id_itempedido, IC.quantidade, IC.total, P.preco,PD.id_pedido
    FROM itempedido IC 
    INNER JOIN pedido PD ON IC.id_pedido = PD.id_pedido
    INNER JOIN produto P ON IC.id_produto = P.id_produto
    WHERE P.titulo_produto = ${titulo_produto} AND PD.id_pedido = ${cartId}
    ORDER BY IC.id_itempedido ASC;
    `;
    let quantidade =
      acao === "increase"
        ? item.quantidade + 1
        : item.quantidade - 1 < 1
        ? 1
        : item.quantidade - 1;
    const itemAlterado = await db.itempedido.update({
      where: { id_itempedido: item.id_itempedido },
      data: { quantidade: quantidade, total: quantidade * item.preco },
    });

    res.status(200).json(itemAlterado);
    return { itemAlterado };
  } catch (error) {
    console.error("erro ao alterar a quntidade de produtos", error);
  }
}

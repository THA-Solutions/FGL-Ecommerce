import db from "../../../lib/db";

export default async function remCartItem(req, res) {
  try {
    const email = req.query.email;
    const user = await db.user.findUnique({
      where: { email: email },
    });

    const alteredCart = await db.pedido.update({
      where: {
        id_usuario: user.id,
        status: "ATIVO",
      },
      data: {
        status: "EM ANDAMENTO",
      },
    });
    return alteredCart;
  } catch (error) {
    console.error("erro ao alterar a quntidade de produtos", error);
  }
}

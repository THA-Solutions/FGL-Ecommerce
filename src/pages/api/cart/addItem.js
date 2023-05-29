import db from "../../../lib/db";

export default async function handlerCartItems(req, res) {
  try {
    const { shoppingCart, totalValue, email } = req.body;
    const cartItems = async () => {
      const userPedido = await db.user.findFirst({
        where: {
          email: email,
          pedido: {
            some: {
              status: "ATIVO",
            },
          },
        },
        select: {
          id: true,
          pedido: {
            select: {
              id_pedido: true,
            },
            where: {
              status: "ATIVO",
            },
          },
        },
      });
      const checkIfInCart = await Promise.all(
        shoppingCart.map(async (item) => {
          try {
            const productInCart = await db.itempedido.findFirst({
              where: {
                titulo_produto: item.titulo,
                id_pedido: userPedido.pedido[0].id_pedido,
              },
            });
            if (productInCart) {
              let quantidade = productInCart.quantidade++;
              console.log(typeof(quantidade),typeof(item.preco))
              const produto_updtd = await db.itempedido.update({
                where: { id_itempedido: productInCart.id_itempedido},
                data: {
                  quantidade: quantidade,
                  total: (Number(item.preco) * quantidade),
                },
              });
              return produto_updtd;
            } else {
              const produto_crtd = await db.itempedido.create({
                data: {
                  id_produto: item.id,
                  id_pedido: userPedido.pedido[0].id_pedido,
                  titulo_produto: item.titulo,
                  quantidade: item.quantidade,
                  total: item.preco * item.quantidade,
                },
              });
              return produto_crtd;
            }
          } catch (error) {
            console.error(error);
            throw new Error("Erro ao adicionar produto ao carrinho.");
          }
        })
      );

      return checkIfInCart;
    };

    const itemsAddedToCart = await cartItems();
    res.json(itemsAddedToCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar o item no carrinho." });
  }
}

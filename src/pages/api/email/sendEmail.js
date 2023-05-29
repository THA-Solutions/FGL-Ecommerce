const nodemailer = require("nodemailer");
import UInumber from "@/UI/UInumber";
import Image from "next/image";

export default async function sendEmail(req, res) {
  try {
    var transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });
    const { itemCart, total,session} = req.body;
    console.log(session)
    const items = itemCart.map((item) => {
      return `
        <div 
          style=
            "background-color:lightgray; 
            font-size:18px; 
            padding: 1em; 
            border-radius: 10px; 
            justify-content: center; 
            align-items: center;
            margin-bottom: 1em;"
        >
          <img src="${item.img}" alt="imagem_produto" />
          <h4>${item.titulo_produto}</h4>
          <h4>Quantidade: ${item.quantidade}</h4>
          <h4>Total do produto: ${item.total}</h4>

        </div>`;
    });

    const emailTemplate = `
    <div style="padding: 1em; background-color: red;">
      <h1 style="text-align: center; font-size: 30px;">Novo Pedido Realizado</h1>
      
      <h2 style="font-size: 25px;">Cliente</h2>
      <div 
        style=
          "background-color:lightgray;
          display: flex;
          justify-content: space-between;
          font-size:18px;
          padding: 1em;
          border-radius: 10px;
          align-items: center;
          margin-bottom: 1em;"
      >
        <div>
          <h3>Dados pessoais</h3>
          <h4>Nome: ${session.user.name}</h4>
          <h4>Email:  ${session.user.email}</h4>
          <h4>Telefone: ${1}</h4>
        </div>    
        <div>
          <h3>Endereço</h3>
          <h4>CEP : ${1}</h4>        
          <h4>Estado : ${1}</h4>        
          <h4>Cidade : ${1}</h4>        
          <h4>Logradouro : ${1}</h4>        
        </div>
      </div>

      <hr />
      <h2 style="font-size: 25px;">Produtos</h2>
      ${items}
      
      <hr />
      <div style="background-color: lightblue; border-radius: 10px; padding: 1em; margin-top: 1em">
        <h2>Valor total da compra: ${total}</h2>
      </div>
    </div>`;

    const message = {
   
      to: "pateb36847@pgobo.com",
      subject: "Informações de pedido",
      html: emailTemplate,
    };

    try {
      const sentEmail = transport.sendMail(message);
    } catch (error) {
      console.error(error);
    }

    res.json({ erro: false, mensagem: "Email enviado com sucesso" });
  } catch (error) {
    res.json({ erro: true, mensagem: "Erro - Email não enviado" });
  }
}

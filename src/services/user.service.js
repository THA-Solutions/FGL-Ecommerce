import db from "../lib/db";
import bcrypt from "bcryptjs";

export async function register(body) {
  const userData = JSON.parse(body);
  try {
    const user = await db.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      throw new Error("E-mail já cadastrado!");
    } else {
      const createdUser = await db.user.create({
        data: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          password: userData.password,
          phone: Number(userData.phone),
        },
      });
      return createdUser;
    }
  } catch (error) {
    console.error("Erro na criacao do usuario", error);
  }
}

export async function registerAddress(body) {
  const addressData = JSON.parse(body);

  const user = await db.user.findUnique({
    where: {
      email: addressData.userEmail,
    },
  });

  console.log("Endereço: ", addressData);
  console.log("Usuário: ", user);

  // if (!user.id_endereco) {
  //   const createdAddress = await db.endereco.create({
  //     data: {
  //       cep: addressData.cep,
  //       logradouro: addressData.logradouro,
  //       numero: addressData.numero,
  //       bairro: addressData.bairro,
  //       complemento: addressData.complemento,
  //       cidade: addressData.cidade,
  //       estado: addressData.estado,
  //       id_usuario: user.id,
  //     },
  //   });

  //   db.user.update({
  //     where: {
  //       id: user.id,
  //     },
  //     data: {
  //       id_endereco: createdAddress.id,
  //     },
  //   });
  // }

  // return createdAddress;
}

export async function singInResquest(body) {
  try {
    const userData = body;
    console.log(userData, "QLQ COISA 2");
    const user = await db.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    console.log(user, "QLQ COISA");
    const validate = bcrypt.compareSync(userData.password, user.password);
    if (validate) {
      return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        id: user.id,
      };
    } else {
      console.log("Senha incorreta!");
    }
  } catch (error) {
    console.error(error, "Falha ao logar");
    throw new Error("Senha incorreta!");
  }
}

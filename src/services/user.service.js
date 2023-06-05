import db from "../lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuid } from 'uuid'
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
          name: userData.firstName,
          sobrenome: userData.lastName,
          email: userData.email,
          password: userData.password,
          phone: Number(userData.phone),
        },
      });
      const session= await db.session.create({data:{userId:createdUser.id,sessionToken:uuid(),expires: new Date(Date.now() + 1000 * 60 * 60 * 12)}})
      console.log(session)
      return createdUser;
    }
  } catch (error) {
    console.error("Erro na criacao do usuario", error);
  }
}




export async function registerAddress(body) {
  try {
    const addressData = JSON.parse(body);

    const user = await db.user.findFirst({
      where: { email: addressData.userEmail },
    });

    const address = await db.endereco.findMany({ where: { userId: user.id } });

    if (!address) {
      console.log("adress", address);
      return address;
    } else {
      const createdAddress = await db.endereco.create({
        data: {
          cep: Number(addressData.cep),
          logradouro: addressData.logradouro,
          numero: Number(addressData.numero),
          bairro: addressData.bairro,
          complemento: addressData.complemento,
          cidade: addressData.cidade,
          estado: addressData.estado,
          userId: user.id,
        },
      });
      
      return createdAddress;
    }
  } catch (error) {
    console.error("Erro na criacao do endereço", error);
  }
}

export async function updateAddress(body) {
  try {
    const addressData = JSON.parse(body);
    console.log("addressData", addressData);

    const user = await db.user.findUnique({
      where: {
        email: addressData.userEmail,
      },
    });

    console.log("user", user);

    const address = await db.endereco.findMany({
      where: {
        userId: user.id,
      },
    });

    console.log("address", address);

    const updatedAddress = await db.endereco.update({
      where: {
        id_endereco: address[0].id_endereco,
      },
      data: {
        cep: Number(addressData.cep),
        logradouro: addressData.logradouro,
        numero: Number(addressData.numero),
        bairro: addressData.bairro,
        complemento: addressData.complemento,
        cidade: addressData.cidade,
        estado: addressData.estado,
      },
    });
    console.log("updatedAddress", updatedAddress);
    return updatedAddress;
  } catch (error) {
    console.error("Erro na atualização do endereço", error);
  }
}

export async function checkAddress(param) {
  try {
    const user = await db.user.findFirst({ where: { email: param } });
    if (user) {
      const address = await db.endereco.findMany({
        where: { userId: user.id },
      });
      return address;
    } else {
      return null;
    }
  } catch {
    console.error("Erro ao buscar endereço", error);
  }
}

export async function singInResquest(body) {
  try {
    const userData = body;
    const user = await db.user.findFirst({
      where: {
        email: userData.email,
      },
    });
    
  if (user) {
  const validate = bcrypt.compareSync(userData.password, user.password);
    if (validate) {
      return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastName: user.sobrenome,
        id: user.id
      };
    } else {
      return null;
    }
  } else {
  return null
  }
    
  } catch (error) {
    console.error(error, "Falha ao logar");
    throw new Error("Senha incorreta!");
  }
}

export async function findUser(token){
    const session = db.session.findFirst({
        where:{session_token:token},
    })
    const user= await db.user.findUnique({
        where:{id:session.userId},
    })
    return user
}
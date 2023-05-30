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
          nome: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          senha: userData.password,
          telefone: Number(userData.phone),
        },
      });
      return createdUser;
    }
  } catch (error) {
    console.error("Erro na criacao do usuario", error);
  }
}

export async function registerAddress(body) {
  try {
    const addressData = JSON.parse(body);
    const user = await db.user.findUnique({where:{email:addressData.userEmail}})
  const address= await db.endereco.findMany({where:{	userId:user.id}})
   if (address) {
    return address
   }else{
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
    console.error("Erro na criacao do endereço", error)
  }
}

export async function checkAddress(param){
  try{
  const user = await db.user.findUnique({where:{email:param}})
  if(user){
  const address= await db.endereco.findMany({where:{	userId:user.id}})
  return address
  }else{
    return
  }
  }catch{
    console.error("Erro ao buscar endereço", error)
  }
}

export async function singInResquest(body) {
  try {
    const userData = body;
    console.log(userData, "a");
    const user = await db.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    console.log(user, "user");
    const validate = bcrypt.compareSync(userData.password, user.password);
    if (validate) {
      return {
        name: user.nome,
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

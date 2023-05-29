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
        nome: (`${userData.firstName} ${userData.lastName}`),
        email: userData.email,
        senha: userData.password,
        telefone: Number(userData.phone),
      },
    });
    return createdUser;
  }} 
  catch (error) {
  console.error("Erro na criacao do usuario",error)
  }
}

export async function singInResquest(body) {
  try {
    const userData = body;
    console.log(userData,'a')
    const user = await db.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    console.log(user,"user")
    const validate = bcrypt.compareSync(userData.password, user.senha);
    if (validate) {
      return ({name: user.nome, email: user.email, phone: user.phone, id: user.id});
    } else {
      console.log("Senha incorreta!");
    }
  } catch (error) {
    console.error(error,"Falha ao logar")
    throw new Error("Senha incorreta!");
  }
}

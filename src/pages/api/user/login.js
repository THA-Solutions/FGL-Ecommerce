import { singInResquest } from "../../../services/user.service";

export default async function handler(req, res) {
  try {
    const {credentials} = req.body;
    const user = await singInResquest(credentials);
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: Number(user.phone)
    }
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

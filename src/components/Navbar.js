import React, { useContext, useState } from "react";
import SearchBar from "./SearchBar";
import SearchMenu from "./SearchBarMenu";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import fgl from "../../public/fgl_logo.png";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { BsCartFill, BsFillPersonFill } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import { FilterContext } from "@/context/FilterContext";

export default function Navbar() {
  const { data: session } = useSession();
  const [toggleMenu, setToggleMenu] = useState(false);
  const { handleOnCheckbox} = useContext(FilterContext);
  return (
    <>
      <div className={styles.navbar}>
        <Link href="/">
          <Image
            priority={true}
            className={styles.navbar_img}
            src={fgl}
            alt="Logo FGL Distribuidora"
          />
        </Link>
        <SearchBar />
        <div className={styles.navbar_button}>
          <Link className={styles.link} href="/Cart">
            <button>
              CARRINHO <BsCartFill />
            </button>
          </Link>
          {!session ? (
            // <Link className={styles.link} href="/Login">
            //   <button>
            //     LOGIN <BsFillPersonFill />
            //   </button>
            // </Link>
            <button onClick={() => signIn()}>
              LOGIN <BsFillPersonFill />
            </button>
          ) : (
            <Link className={styles.link} href="/Perfil">
              <button>
                PERFIL <BsFillPersonFill />
              </button>
            </Link>
          )}
        </div>
        <div className={styles.navbar_menu}>
          {toggleMenu ? (
            <RiCloseLine
              color="#000"
              size={27}
              onClick={() => setToggleMenu(false)}
            />
          ) : (
            <RiMenu3Line
              color="#000"
              size={27}
              onClick={() => setToggleMenu(true)}
            />
          )}
          {toggleMenu && (
            <div className={styles.navbar_menu_container}>
              <div className={styles.navbar_menu_items}>
                <input className={styles.link_menu} type="checkbox" name="categoria" value="inversor" onChange={handleOnCheckbox}
                  Inversores
                />

                <Link className={styles.link_menu}  type="checkbox" name="categoria" value="monitoramento" onChange={handleOnCheckbox}>
                  Monitoramento
                </Link>

                <Link className={styles.link_menu} type="checkbox"  name="categoria" value="painel" onChange={handleOnCheckbox}>
                  Painéis
                </Link>

                <Link className={styles.link_menu} type="checkbox" name="categoria" value="microinversor" onChange={handleOnCheckbox}>
                  Micro-Inversores
                </Link>
                <SearchMenu />
                <Link className={styles.button_menu} href="/Cart">
                  <button>
                    CARRINHO <BsCartFill />
                  </button>
                </Link>
                <Link className={styles.button_menu} href="/Login">
                  <button>
                    LOGIN <BsFillPersonFill />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.category_container}>
        <Link href="/geradores">Geradores</Link>
        <Link href="/inversores">Inversores</Link>
        <Link href="/monitoramento">Monitoramento</Link>
        <Link href="/paineis">Painéis</Link>
        <Link href="/micro-inversores">Micro-Inversores</Link>
      </div>
    </>
  );
}

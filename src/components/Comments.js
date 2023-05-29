import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Comments.module.css";

export default function Comments(comment) {
  const [descricao, setComment] = useState("");

  const changeComment = (txt) => {
    setComment(txt.target.value);
  };

  const [comment_cont, setCommentCont] = useState([]);

  const createDivsFromComments = (comments) => {
    return comments.map((comentario) => {
      return (
        <div
          className={styles.comment_container}
          key={comentario.id_comentario}
        >
          <div className={styles.user_date_container}>
            <h3 className={styles.user_comment}>Usuário: {comentario.nome}</h3>
            <h3 className={styles.date_comment}>
              Data: {comentario.data_lancamento}
            </h3>
          </div>

          <p className={styles.comment}>{comentario.descricao}</p>

          {/* <div className="small d-flex justify-content-start">
            <a href="#!" className="d-flex align-items-center me-3">
              <i className="far fa-comment-dots me-2"></i>
              <p className="mb-0">Comentar</p>
            </a>
          </div> */}
        </div>
      );
    });
  };

  useEffect(() => {
    let data = comment.comment.map((comment) => {
      return {
        descricao: comment.descricao,
        data_lancamento: comment.data_lancamento,
      };
    });

    let newDivs = createDivsFromComments(data);

    if (comment_cont.length === 0) {
      setCommentCont([...comment_cont, ...newDivs]);
    }
  }, [comment]);

  const id = comment.id;

  const handleSubmit = async () => {
    if (descricao == "") {
    } else {
      try {
        const comment = {
          descricao: descricao,
          id: id,
        };
        const response = await axios.post(
          "http://localhost:3000/api/comments/postComment",
          {
            comment: comment,
          }
        );
        const newComment = {
          descricao: descricao,
          data_lancamento: new Date().toLocaleDateString(), // assume que a data é a data atual
        };
        let newDivs = createDivsFromComments([newComment]);
        setCommentCont([...comment_cont, newDivs]);
        setComment("");
      } catch (error) {
        console.error("erro ao salvar comentario", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Comentarios</h2>
      <div className={styles.postComment_container}>
        <textarea
          rows="5"
          value={descricao}
          onChange={changeComment}
        ></textarea>

        <div className={styles.button_container}>
          <button
            type="button"
            className={styles.button_postComment}
            onClick={handleSubmit}
          >
            Publicar Comentário
          </button>
          <button
            type="button"
            className={styles.button_cancelComment}
            onClick={() => {
              setComment("");
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
      <hr />
      <div>
        {comment_cont.map((comentario, index) => (
          <div key={index}>{comentario}</div>
        ))}
      </div>
    </div>
  );
}

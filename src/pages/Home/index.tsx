import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Helmet } from "react-helmet";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Fragment>
        <Helmet>
            <title>简易的服务器端渲染 - HOME</title>
            <meta name="description" content="服务器端渲染"></meta>
        </Helmet>
        <div>
            <h1>hello-ssr</h1>
            <button
                onClick={(): void => {
                    alert("hello-ssr");
                }}
            >
                alert
            </button>
            <a href="http://127.0.0.1:3000/demo">链接跳转</a>
            <span
                onClick={(): void => {
                navigate("/demo");
                }}
            >
                路由跳转
            </span>
        </div>
    </Fragment>
  );
};

export default Home;
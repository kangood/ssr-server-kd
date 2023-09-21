/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, Fragment } from "react";
import { connect } from "react-redux";
import { getDemoData } from "./store/demoReducer";
import { Helmet } from "react-helmet"

interface IProps {
  content?: string;
  getDemoData?: (data: string) => void;
}

const Demo: FC<IProps> = (data) => {
  // const [content, setContent] = useState("");
  // // 客户端调用API，没有在SSR
  // useEffect(() => {
  //   axios
  //     .post("/api/getDemoData", {
  //       content: "这是一个demo页面",
  //     })
  //     .then((res: any) => {
  //       setContent(res.data?.data?.content);
  //     });
  // }, []);

  return (
    <Fragment>
      <Helmet>
        <title>简易的服务器端渲染框架 - DEMO</title>
        <meta name="description" content="服务器端渲染框架"></meta>
      </Helmet>
      <div>
        <h1>{data.content}</h1>
        <button
          onClick={(): void => {
            data.getDemoData && data.getDemoData("刷新过后的数据");
          }}
        >
          刷新
        </button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => {
  // 将对应reducer的内容透传回dom
  return {
    content: state?.demo?.content,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getDemoData: (data: string) => {
      dispatch(getDemoData(data));
    },
  };
};

// connect入参state和dispatch，返回content和getDemoData
const storeDemo: any = connect(mapStateToProps, mapDispatchToProps)(Demo);

// 初始化的函数，两个入参，一个透传 store，另一个 data
storeDemo.getInitProps = (store: any, data?: string) => {
  return store.dispatch(getDemoData(data || "这是初始化的demo"));
};

export default storeDemo;
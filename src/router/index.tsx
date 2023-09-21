import Home from "@/pages/Home";
import Demo from "@/pages/Demo";

interface IRouter {
  path: string;
  element: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadData?: (store: any) => any;
}

const router: Array<IRouter> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/demo",
    element: <Demo />,
    // demo页面初始化方法
    loadData: Demo.getInitProps,
  },
];

export default router;
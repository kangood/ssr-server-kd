/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import path from "path";
import router from "@/router";
import { Route, RouteObject, Routes, matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { serverStore } from "@/store";


const app = express();

const bodyParser = require("body-parser");

// 请求body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 注入事件处理的脚本
app.use(express.static(path.resolve(process.cwd(), "client_build")));

// 启一个post服务，对外提供API
app.post("/api/getDemoData", (req, res) => {
    res.send({
        data: req.body,
        status_code: 0,
    });
});

app.get("*", (req, res) => {
    // 遍历所有的初始化方法，然后统一请求塞进 store 里
    const routeMap = new Map<string, () => Promise<any>>(); // path - loaddata 的map
    router.forEach((item) => {
        if (item.path && item.loadData) {
            routeMap.set(item.path, item.loadData(serverStore));
        }
    });

    // 匹配当前路由的routes
    const matchedRoutes = matchRoutes(router as RouteObject[], req.path);

    const promises: Array<() => Promise<any>> = [];
    matchedRoutes?.forEach((item) => {
        if (routeMap.has(item.pathname)) {
            promises.push(routeMap.get(item.pathname) as () => Promise<any>);
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Promise.all(promises).then((data) => {
        // 统一放到state里
        // 编译需要渲染的JSX, 转成对应的HTML STRING
        const content = renderToString(
            <Provider store={serverStore}>
                <StaticRouter location={req.path}>
                    <Routes>
                    {router?.map((item, index) => {
                        return <Route {...item} key={index} />;
                    })}
                    </Routes>
                </StaticRouter>
            </Provider>
        );

        const helmet = Helmet.renderStatic();

        // 注水（服务器端请求拿到 store 以后，对数据进行注入）
        res.send(`
            <html>
                <head>
                    ${helmet.title.toString()}
                    ${helmet.meta.toString()}
                </head>
                <body>
                    <div id="root">${content}</div>
                    <script>
                        window.context = {
                            state: ${JSON.stringify(serverStore.getState())}
                        }
                    </script>
                    <script src="/index.js"></script>
                </body>
            </html>
        `);
    });
});

app.listen(3000, () => {
    console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
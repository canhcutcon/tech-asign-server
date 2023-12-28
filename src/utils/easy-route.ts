import { ServerRoute } from "hapi";

const ALLOWED_METHODS = ['get', 'post', 'put', 'delete', 'patch'];

class Router {
    _routes: ServerRoute[] = [];

    constructor(routes = []) {
        this._routes = routes;
    }

    applyRouteHoF(hof: (route: any) => any) {
        if (typeof hof !== "function") {
            throw Error(`HOF must be a function, got ${hof}`);
        }

        this._routes = this._routes.map((route) => {
            return hof(route);
        });
    }

    allRoutes() {
        return this._routes;
    }

    addRoute(method: string, path: string, handler: () => {}, options?: {}) {
        this._routes.push(EasyRoute.makeSingleRoute({ method, path, handler, options }));
    }

    GET(path: string, handler: () => {}, options?: {}) {
        this.addRoute("GET", path, handler, options);
    }

    POST(path: string, handler: () => {}, options?: {}) {
        this.addRoute("POST", path, handler, options);
    }

    PUT(path: string, handler: () => {}, options?: {}) {
        this.addRoute("PUT", path, handler, options);
    }

    PATCH(path: string, handler: () => {}, options?: {}) {
        this.addRoute("PATCH", path, handler, options);
    }

    DELETE(path: string, handler: () => {}, options?: {}) {
        this.addRoute("DELETE", path, handler, options);
    }

    group(prefix = "", routes = []) {
        if (!prefix || routes.length === 0) {
            return;
        }

        for (const route of routes) {
            if (route.length) {
                this.group(prefix, route);
            } else {
                this._routes.push(
                    EasyRoute.makeSingleRoute({
                        ...route,
                        path: `${prefix}${route.path}`,
                        options: { ...route.options || {} },
                        handler: route.handler || route.config,
                    })
                );
            }
        }
    }
}


export default class EasyRoute {
    static makeSingleRoute({ method, path, handler, options = {} }:
        {
            method: string;
            path: string;
            handler: () => {} | Function;
            options?: {};
        }) {

        if (!ALLOWED_METHODS.includes(method)) {
            throw new Error(`Method ${method} is not allowed`);
        }

        if (typeof handler !== 'function') {
            throw new Error(`Handler must be a function`);
        }

        if (typeof path !== 'string') {
            throw new Error(`Path must be a string`);
        }

        path = path.endsWith('/') ? path.slice(0, -1) : path;

        const route = {
            method,
            path,
            options,

        };

        if (options['auth']) {
            route['options']['auth'] = options['auth'];
        }

        if (options['validate']) {
            route['options']['validate'] = options['validate'];
        }

        if (options['files']) {
            route['options']['files'] = options['files'];
        }
        if (options['payload']) {
            route['options']['payload'] = options['payload'];
        }

        if (options['cors']) {
            route['options']['cors'] = options['cors'];
        }

        if (typeof handler === 'function') {
            route['config'] = {
                description: "",
                tags: ["api", "Default"],
                pre: [],
                validate: {},
                handler: handler || (() => { }),
            };
        } else {
            route['handle'] = handler;
        }

        return route;
    }

    static Methods = {
        GET: (path: string, handler: () => {} | Function, options?: {}) => EasyRoute.makeSingleRoute({ method: 'get', path, handler, options }),
        POST: (path: string, handler: () => {} | Function, options?: {}) => EasyRoute.makeSingleRoute({ method: 'post', path, handler, options }),
        PUT: (path: string, handler: () => {} | Function, options?: {}) => EasyRoute.makeSingleRoute({ method: 'put', path, handler, options }),
        DELETE: (path: string, handler: () => {} | Function, options?: {}) => EasyRoute.makeSingleRoute({ method: 'delete', path, handler, options }),
        PATCH: (path: string, handler: () => {} | Function, options?: {}) => EasyRoute.makeSingleRoute({ method: 'patch', path, handler, options }),
    };

    static Auth = {
        Required: (strategy: string) => ({ auth: strategy }),
        Optional: (strategy: string) => ({ auth: { strategy, mode: 'optional' } }),
        Scope: (strategy: string, scope: string | string[]) => ({ auth: { strategy, scope } }),
    };

    static Validate = {
        Payload: (schema: any) => ({ payload: schema }),
        Params: (schema: any) => ({ params: schema }),
        Query: (schema: any) => ({ query: schema }),
        Headers: (schema: any) => ({ headers: schema }),
    };

    static Files = {
        RelativeTo: (path: string) => ({ relativeTo: path }),
    };

    static Cors = {
        Origin: (origin: string | string[]) => ({ origin }),
        Credentials: (credentials: boolean) => ({ credentials }),
        AdditionalHeaders: (additionalHeaders: string[]) => ({ additionalHeaders }),
    };

    static Payload = {
        Multipart: (maxBytes: number, output: string) => ({ multipart: { maxBytes, output } }),
        Parse: (allow: string[], output: string) => ({ parse: { allow, output } }),
        Output: (data: string, options: any) => ({ output: data, options }),
        FailAction: (error: any, options: any) => ({ failAction: error, options }),
    };

    static Response = {
        Schema: (schema: any) => ({ schema }),
        Status: (status: any) => ({ status }),
        Sample: (sample: any) => ({ sample }),
        FailAction: (error: any, options: any) => ({ failAction: error, options }),
    };

    static Group = (prefix: string, routes: any[]) => {
        if (!prefix || !routes.length) {
            return [];
        }

        const _routes = [];
        for (const route of routes) {
            if (route.length) {
                _routes.push(...EasyRoute.Group(prefix, route));
                continue;
            }

            _routes.push(this.makeSingleRoute({
                ...route, path: `${prefix}${route.path}`,
                options: { ...route.options },
                handler: route.handler
            }
            ));
        }

        return _routes;
    }

    static makeRouter() {
        return new Router();
    }
}
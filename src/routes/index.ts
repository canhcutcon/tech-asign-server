import { ServerRoute } from 'hapi';
import EasyRoute from '../utils/easy-route';

// const { GET, POST } = EasyRoute.Methods;

// const router = EasyRoute.makeRouter();

// router.group('/api', [
//     GET('/hello', () => 'Hello World!', {},),
//     POST('/hello', () => 'Hello World!', {},),
// ]);

// const serverRoute: ServerRoute[] = router.allRoutes();
// export default serverRoute;

export default [
    {
        method: 'GET',
        path: '/hello',
        handler: () => 'Hello World!',
    },
    {
        method: 'POST',
        path: '/hello',
        handler: () => 'Hello World!',
    },
]

declare module 'http-proxy-middleware' {
  import { RequestHandler } from 'express';

  interface Options {
    target?: string;
    changeOrigin?: boolean;
    pathRewrite?: { [pattern: string]: string } | ((path: string, req: any) => string);
    [key: string]: any;
  }

  export function createProxyMiddleware(options: Options): RequestHandler;
}


declare namespace Deno {
  export const env: {
    get(name: string): string | undefined;
  };

  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
}

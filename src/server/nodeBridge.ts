import type { IncomingMessage, ServerResponse } from 'http';

export async function handleNodeRequest(
  req: IncomingMessage,
  res: ServerResponse,
  handler: (request: Request) => Promise<Response>
) {
  try {
    const protocol = (req.socket as any)?.encrypted ? 'https' : 'http';
    const host = req.headers.host || 'localhost:3000';
    const url = new URL(req.url || '/', `${protocol}://${host}`);

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (Array.isArray(val)) {
        for (const item of val) headers.append(key, item);
      } else if (val !== undefined) {
        headers.set(key, val);
      }
    }

    let bodyBuffer: Buffer | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      bodyBuffer = Buffer.concat(chunks);
    }

    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers,
      body: bodyBuffer as any,
      // @ts-ignore
      duplex: 'half',
    });

    const webResponse = await handler(webRequest);

    res.statusCode = webResponse.status;
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const arrayBuffer = await webResponse.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Node bridge error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: error?.message || 'Internal Server Error' }));
  }
}

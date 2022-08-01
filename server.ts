import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const HTML = await Deno.readFile("./index.html");
serve(async () => {
  return new Response(HTML, {
    headers: {
      "content-type": "text/html",
    },
  });
});

import net from "node:net";

const listenPort = Number(process.env.AGENTGUARD_PROXY_PORT ?? 3002);
const targetPort = Number(process.env.AGENTGUARD_PORT ?? 3001);

const server = net.createServer((client) => {
  const target = net.createConnection({
    host: "::1",
    port: targetPort,
    family: 6,
  });

  client.pipe(target);
  target.pipe(client);

  const close = () => {
    client.destroy();
    target.destroy();
  };

  client.on("error", close);
  target.on("error", close);
});

server.listen(listenPort, "0.0.0.0", () => {
  console.log(
    `AgentGuard Docker proxy listening on 0.0.0.0:${listenPort} -> [::1]:${targetPort}`,
  );
});

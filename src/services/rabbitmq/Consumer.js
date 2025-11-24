require("dotenv").config;
const amqp = require("amqplib");
const ExportsService = require("./ExportsService");
const PlaylistService = require("../postgres/PlaylistsService");
const CollaborationsService = require("../postgres/CollaborationsService");

const init = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:songs", { durable: true });

  const playlistsService = new PlaylistService();
  const collaborationsService = new CollaborationsService();
  const exportsService = new ExportsService({
    playlistsService,
    collaborationsService,
  });

  channel.consume("export:songs", async (msg) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(msg.content.toString());

      const data = await exportsService.getPlaylistSongs(playlistId);
      await exportsService.sendEmail(targetEmail, data);

      channel.ack(msg);
    } catch (err) {
      console.log("Export listener error:", err);
      channel.ack(msg);
    }
  });
};

init();
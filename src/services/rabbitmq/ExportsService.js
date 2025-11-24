const nodemailer = require('nodemailer');
const InvariantError = require('../../exceptions/InvariantError');

class ExportsService {
    constructor({ playlistsService, collaborationsService }) {
        this._playlistsService = playlistsService;
        this._collaborationsService = collaborationsService;
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

    async getPlaylistSongs(playlistId) {
        const playlist = await this._playlistsService.getPlaylistById(playlistId);
        const songs = await this._playlistsService.getSongsFromPlaylist(playlistId);

        return {
            playlist,
            songs,
        }
    }

    async sendEmail(targetEmail, data) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
        });

        const message = {
            from: 'OpenMusic API <noreply@likzili.dev>',
            to: targetEmail,
            subject: 'Ekspor Lagu Playlist',
            text: 'Terlampir hasil ekspor playlist:',
            attachments: [
                {
                    filename: 'songs.json',
                    content: JSON.stringify(data, null, 2),
                },
            ],
        };

        await transporter.sendMail(message);
    }
}

module.exports = ExportsService;
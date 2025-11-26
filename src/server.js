require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/music/songs');

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const { AlbumsTextValidator, AlbumsCoverValidator } = require('./validator/music/albums');

// Albums Likes
const albumsLikes = require('./api/albums-likes');
const AlbumsLikesService = require('./services/postgres/AlbumsLikesService');
const AlbumLikesValidator = require('./validator/music/albumsLikes');

// Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/music/playlists');

// Export Songs
const exportedSongs = require('./api/export-songs-from-playlist');
const ExportsService = require('./services/rabbitmq/ExportsService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportSongsValidator = require('./validator/music/exportSongsFromPlaylist');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Playlist Song Activities
const playlistSongActivities = require('./api/playlistSongActivities');
const PlaylistSongActivitiesService = require('./services/postgres/PlaylistSongActivitiesService');
const PlaylistSongActivitiesValidator = require('./validator/music/playlistSongActivities');

// Auth
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Storage
const S3StorageService = require('./services/S3/S3StorageService');

// Cache
const CacheService = require('./services/redis/CacheService');

// Config
const config = require('./utils/config.js');

// Client Error
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port || 3000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const cacheService = new CacheService();
  await cacheService.connect();
  const s3StorageService = new S3StorageService();
  const albumsLikesService = new AlbumsLikesService(albumsService, cacheService);
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const usersService = new UsersService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService, playlistSongActivitiesService, cacheService);
  const exportsService = new ExportsService(playlistsService, collaborationsService);
  const producerService = new ProducerService();
  const authenticationsService = new AuthenticationsService();

  await server.register([
    {
      plugin: Jwt,
    }
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      }
    })
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        storageService: s3StorageService,
        textValidator: AlbumsTextValidator,
        imageValidator: AlbumsCoverValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistValidator
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistSongActivities,
      options: {
        playlistsService,
        playlistSongActivitiesService,
        validator: PlaylistSongActivitiesValidator,
      },
    },
    {
      plugin: exportedSongs,
      options: {
        exportsService,
        producerService,
        validator: ExportSongsValidator,
      }
    },
    {
      plugin: albumsLikes,
      options: {
        albumsLikesService,
        albumsService,
        validator: AlbumLikesValidator,
      }
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (!(response instanceof Error)) {
      return h.continue;
    }

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const { statusCode } = response.output;
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(statusCode);
      return newResponse;
    }

    const newResponse = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    newResponse.code(500);
    return newResponse;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);

};

init();

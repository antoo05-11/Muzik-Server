const db = require('../models');

export const Playlist = db.playlists;
export const Playlist_song = db.playlist_songs;
export const User = db.users;
export const Artist = db.artists;
export const Song = db.songs;

Playlist.belongsTo(User, { foreignKey: 'userID' });
Playlist_song.belongsTo(Playlist, { foreignKey: 'playlistID' });
Playlist_song.belongsTo(Song, { foreignKey: 'songID' });
Song.belongsTo(Artist, { foreignKey: 'artistID' });
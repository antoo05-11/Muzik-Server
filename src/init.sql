CREATE TABLE artists (
    artistID INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(255),
    imageURL NVARCHAR(255)
);

CREATE TABLE albums (
    albumID INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(255),
    imageURL NVARCHAR(255)
);

CREATE TABLE songs (
    songID INT AUTO_INCREMENT PRIMARY KEY,
    songURL NVARCHAR(255),
    artistID INT,
    name NVARCHAR(255),
    albumID INT,
    imageURL NVARCHAR(255),
    FOREIGN KEY (artistID) REFERENCES artists(artistID),
    FOREIGN KEY (albumID) REFERENCES albums(albumID)
);

CREATE TABLE playlists (
    playlistID INT AUTO_INCREMENT PRIMARY KEY,
    dateAdded DATE
);

CREATE TABLE playlist_songs (
    playlistID INT,
    songID INT,
    dateAdded DATE,
    FOREIGN KEY (playlistID) REFERENCES playlists(playlistID),
    FOREIGN KEY (songID) REFERENCES songs(songID)
);

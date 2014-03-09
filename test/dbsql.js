function getDbSql()
{
  var rtn = "PRAGMA foreign_keys=OFF; BEGIN TRANSACTION; CREATE TABLE [Album] (     [AlbumId] INTEGER  NOT NULL,     [Title] NVARCHAR(160)  NOT NULL,     [ArtistId] INTEGER  NOT NULL,     CONSTRAINT [PK_Album] PRIMARY KEY  ([AlbumId]),     FOREIGN KEY ([ArtistId]) REFERENCES [Artist] ([ArtistId])  		ON DELETE NO ACTION ON UPDATE NO ACTION ); INSERT INTO\"Album\" VALUES(1,'For Those About To Rock We Salute You',1); COMMIT; ";
  return rtn;
}

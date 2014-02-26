
window['googleDriveClient']=null;

var googleDriveClient = null;
var driveClientInit = function()
{
  jQuery('.listFoldersResult').slideDown();
  googleDriveClient = new GoogleDriveClient();
  googleDriveClient.setToken(gapi.auth.getToken().access_token);
  jQuery('.listFoldersResult').slideUp();
};
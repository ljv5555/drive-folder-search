      var CLIENT_ID = '289250050001-olmcs46an2koatpap3kv0grvuaum5asg.apps.googleusercontent.com';
      var SCOPES = [
      	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/drive.install',
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/userinfo.profile'];
/*
      	https://www.googleapis.com/auth/drive
	https://www.googleapis.com/auth/drive.file
	https://www.googleapis.com/auth/drive.readonly
	https://www.googleapis.com/auth/drive.metadata.readonly
	https://www.googleapis.com/auth/drive.appdat
	
	https://www.googleapis.com/auth/userinfo.email
	https://www.googleapis.com/auth/drive.install
	https://www.googleapis.com/auth/drive.file
	https://www.googleapis.com/auth/userinfo.profile

*/

	
      var apiKey = "rsnsv6W5e1iNISYs--YE5ynz";
      //"2ddVyv0mZZZZMGjd0EpjwELghoqT";

      /**
       * Called when the client library is loaded to start the auth flow.
       */
      function handleClientLoad() {
      	gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth, 1);
      }

      /**
       * Check if the current user has authorized the application.
       */
      function checkAuth() {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
            handleAuthResult);
      }

      /**
       * Called when authorization server replies.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authButton = document.getElementById('authorizeButton');
        var logoutButton = document.getElementById('logoutButton');
        if(authResult && !authResult.error) 
        {
        	jQuery(logoutButton).slideDown();
            jQuery(authButton).slideUp();
              // Access token has been successfully retrieved, requests can be sent to the API.
          setTimeout(
        		  function()
          {
        	  jQuery('.listFoldersResult').slideDown();
        	  window['googleDriveClient'] = new GoogleDriveClient();
        	  window['googleDriveClient'].setToken(gapi.auth.getToken().access_token);
        	  jQuery('.listFoldersResult').slideUp();
        	  setTimeout(function(){
        		  window['googleDriveClient'].showChildrenFolders(function(d){jQuery('.r').html(JSON.stringify(d));});
        	  },1000);
        	  
          },1000);
        	
        	//jQuery('.listFolders').slideDown();
        } 
        else 
        {
        	jQuery(logoutButton).slideUp();
            jQuery(authButton).slideDown();
            
          // No access token could be retrieved, show the button to start the authorization flow.
          //authButton.style.display = 'block';
          authButton.onclick = function() {
              gapi.auth.authorize(
                  {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                  handleAuthResult);
          };
        }
      }
      
function logout()
{
	var u = 'https://www.google.com/accounts/Logout?service=wise';
	var w = window.open(u);
	setTimeout(function(){w.close();window.location.href = window.location.href;},1000);
}


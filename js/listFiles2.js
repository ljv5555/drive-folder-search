/**
 * class: GoogleDriveClient
 * @param access_token
 * @returns
 */
function GoogleDriveClient(access_token) {
	var driveFilesUrl = 'https://content.googleapis.com/drive/v2/files';
	
	
	if (!jQuery) {
		var error = 'Error: You must include jQuery to use this script.';
		alert(error);
		return error;
	}
	
	/**
	 * 
	 * @returns
	 */
    var getUrlParams = function() {
        var query = window.location.search;
        var re = /([^&=]+)=?([^&]*)/g;
        var decode = function(str){return decodeURIComponent(str.replace(/\+/g, ' '));};
        var params = {}, e;
        if (query) {
            if (query.substr(0, 1) == '?') {
                query = query.substr(1);
            }

            while (e = re.exec(query)) {
                var k = decode(e[1]);
                var v = decode(e[2]);
                if (params[k] !== undefined) {
                    if (!jQuery.isArray(params[k])) {
                        params[k] = [params[k]];
                    }
                    params[k].push(v);
                } else {
                    params[k] = v;
                }
            }
        }
        return params;
    };

    /**
     * 
     * @param o
     * @returns
     */
	var log = function(o) {
		try {
			console.log(o);
		} catch (e) {
		}
	};
	
	var atoken = null;
	if (access_token) {
		atoken = accessToken;
		jQuery('.token').text(atoken);
	}

	/**
	 * 
	 */
	this.getToken = function() {
		return atoken;
	}
	/**
	 * 
	 */
	this.setToken = function(t) {
		atoken = t;
		jQuery('.token').text(atoken);
	}

	/**
	 * 
	 * @param url
	 * @param callback
	 * @param errorCallback
	 * @param requestParameters
	 * @param doNotSend
	 * @returns
	 */
	var getRequest = function(url, callback, errorCallback, requestParameters, doNotSend) {
		var xhr = new XMLHttpRequest();
		if (requestParameters) {
			if (url.indexOf('?') == -1) {
				url = url + '?';
			} else {
				url = url + '&';
			}
			url = url + jQuery.param(requestParameters);
		}
		xhr.open('GET', url);
		xhr.setRequestHeader('Authorization', 'Bearer ' + atoken);
		xhr.onload = function() {
			callback(xhr.responseText);
		};
		if (errorCallback) {
			xhr.onerror = function(p) {
				errorCallback(p);
			};
		} else {
			xhr.onerror = function(p) {
				alert('Request error: \n' + url + '\nSee console log.');
				try {
					console.log(p);
				} catch (ex) {
				}
			};
		}
		if( !doNotSend ){xhr.send();}
		return xhr;
	};

	/**
	 * 
	 * @param url
	 * @param callback
	 * @param errorCallback
	 * @param requestParameters
	 * @param doNotSend
	 * @returns
	 */
	var getJSON = function(url, callback, errorCallback, requestParameters, doNotSend) 
	{
		return getRequest(url, function(e){callback(JSON.parse(e))}, errorCallback, requestParameters, doNotSend);
	};

	/**
	 * Synchronous get request
	 * @param urlToGet
	 * @param parametersToUse
	 * @returns
	 */
	var sGetRequest = function( urlToGet, parametersToUse )
	{
		if( !parametersToUse ){ parametersToUse = {}; }
		var rtn = '';
		try{
		log('running sGetRequest("'+urlToGet+'",'+JSON.stringify(parametersToUse)+");");
		rtn = jQuery.ajax({
		   url:urlToGet,
		   data:parametersToUse,
		   async:false,
		   headers:{'Authorization': ('Bearer ' + gapi.auth.getToken().access_token)}
		   }).responseText;
		   log('returning: ');
		   log(''+rtn);
		}catch(e)
		{
			//if(error){error('Error: '+e.message);}
			log('Error: ');
			log(''+e.message);
		}
		return rtn;
	};
	var sGetJSON = function(urlToGet, parametersToUse)
	{ 
		return JSON.parse(sGetRequest( urlToGet, parametersToUse ) );
	};
	
	/**
	 * get info for a file by id
	 * @param fileid
	 * @returns
	 */
	var getFileItem = function(fileid)
	{
		var itemurl = driveFilesUrl + '/' + fileid;
		return sGetJSON(itemurl);
	};
	
	var allItemsPages = [];
	this.getAllItemsPages = function()
	{
		return allItemsPages;
	};
	this.getAllItems = function()
	{
		var allitems = [];
		if(allItemsPages && allItemsPages.length && (allItemsPages.length>0))
		{
			for(var i = 0; i<allItemsPages.length;i++)
			{
				if(allItemsPages[i].items)
				{
					var currentItems = allItemsPages[i].items;
					if(currentItems && currentItems.length && (currentItems.length>0))
					{
						
						for(var j = 0; j<currentItems.length;j++)
						{
							var currentItem = currentItems[j];
							allItems.push(currentItem);
						}
					}
				}
				else
				{
					
				}
			}
		}
		
		return allitems;
	};
	
//	var ispageworking = false;
	var getNextPage = function(r)
	{
		allItemsPages.push(r);
		if(r.nextLink)
		{
			getJSON(r.nextLink,function(r2){getNextPage(r2);});
		}
	};

	this.getAllItemsPagesForFolders=function(folderid)
	{
		if(!folderid){folderid='root';}
		var q = {"q":" '"+folderid+"' in parents AND mimeType='application/vnd.google-apps.folder' "};
		getJSON(driveFilesUrl,function(r){getNextPage(r);},false,q);		
	};
		// if(allItemsPages && allItemsPages.length && allItemsPages.length>0)
		// {
		// 	var lastItemsPage = allItemsPages[allItemsPages.length-1];
		// 	var u = lastItemsPage.nextLink;
		// 	if(u)
		// 	{
		// 		var cb = function(r){getJSON();};	
				
		// 	}
		// }

} // end of class

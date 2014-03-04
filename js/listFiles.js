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
		rtn = jQuery.ajax({
		   url:urlToGet,
		   data:parametersToUse,
		   async:false,
		   headers:{'Authorization': ('Bearer ' + gapi.auth.getToken().access_token)}
		   }).responseText;
		}catch(e)
		{
			//if(error){error('Error: '+e.message);}
			log('Error: '+e.message);
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
	
	this.sGetItems = function(url,params)
		{
		        log('calling getrequest to get tmpr...');
			var tmpr = sGetJSON(url,params);
			log(tmpr);
			var items = tmpr.items;
			console.log('tmpr1, length='+items.length);
			if(progressCb){ progressCb(items); }
			while(tmpr.nextPageToken)
			{
			        
				tmpr = sGetJSON(tmpr.nextLink);
				console.log('tmprn, length='+tmpr.items.length);
				console.log(tmpr);
				items = items.concat(tmpr.items);
				if(progressCb){ progressCb(items); }
			}
			return items;
			
		};

	/**
	 * 
	 * @param success
	 * @param error
	 * @param progressCb
	 * @param parametersToUse
	 * @returns
	 */
	var getAllResultPages = function( success, error, progressCb, parametersToUse )
	{
		
		var getItems = function(url,params)
		{
		        log('calling getrequest to get tmpr...');
			var tmpr = sGetJSON(url,params);
			log(tmpr);
			var items = tmpr.items;
			console.log('tmpr1, length='+items.length);
			if(progressCb){ progressCb(items); }
			while(tmpr.nextPageToken)
			{
			        
				tmpr = sGetJSON(tmpr.nextLink);
				console.log('tmprn, length='+tmpr.items.length);
				console.log(tmpr);
				items = items.concat(tmpr.items);
				if(progressCb){ progressCb(items); }
			}
			return items;
			
		};
		
		success(getItems('https://content.googleapis.com/drive/v2/files',parametersToUse));
	};
	
	var userShown = false;
	
	this.showChildrenFolders = function(el)
	{
		if(!userShown)
		{
			try{
				setTimeout(function(){
			var dfsr = sGetRequest(driveFilesUrl+'/root',{"fields":"owners(displayName)"});
			var dfsro = JSON.parse(dfsr);
			userShown=true;
			var dfsro_o=dfsro.owners[0].displayName;
			jQuery('.logout .user').text(dfsro_o);
			// .owners[0].displayName
				},5000);
			}catch(ex1x){}
		}
		
		
		var jqel = jQuery(el);
		jqel.empty();
		
		var urlp = getUrlParams();
		if( urlp && urlp.state ){urlp=JSON.parse(urlp.state);}
		
		// todo: remove this
		if(! ( urlp && urlp.ids && urlp.ids.length && urlp.ids.length>0) ){urlp = {"ids":["root"]};}
		// ,"0B-9SCj66PvWJWHFFVjFQbkExdFk"
		// ?state={ids:["0B-9SCj66PvWJWHFFVjFQbkExdFk"]}
		// http://www.file2url.com/drive-folder-search/?state={%22ids%22:[%220B-9SCj66PvWJWHFFVjFQbkExdFk%22]}
		// http://www.file2url.com/drive-folder-search/?state=%7B%22ids%22:%5B%220B9ICicDg0C8nelFBVVI2dmtZZ3c%22%5D,%22action%22:%22open%22,%22userId%22:%22104178504608779515341%22%7D
		
		
		if(! ( urlp && urlp.ids && urlp.ids.length && urlp.ids.length>0) )
		{
			//TODO: show error message.
			alert('urlp='+urlp);
			log(urlp);
			return;
		}
		var folderids = urlp.ids;
		var i = 0;
		for(i = 0;i<folderids.length;i++)
		{
			var folderid = folderids[i];
			jqel.append('<div class="getFolderName '
			  +folderid
			  +'" id="'
			  +folderid
			  +'" action="getFolderName">'
			  +'<div class="folderTitle" type="folderTitle">Loading folder with id '
			  +folderid+'...</div>'
			  +'<div class="folderChildren" type="folderChildren">'
			  +'</div>'
			  +'</div>');
		}
	};	
	
	/**
	  * thread logic to run - downloads and populates additional info / children as needed
	 **/ 
	var pthread = function()
	{
		var fge = jQuery("*[action='getFolderName']").first();
		if(fge && fge.length && fge.length>0 )
		{
			fge.removeClass('getFolderName');
			var id1 = fge[0].id;
			
			fge.addClass('folderItem');
			var name1o = getFileItem(id1);
			var fget = fge.find("*[type='folderTitle']");
			var fgec = fge.find("*[type='folderChildren']");
			if(!name1o.title){fget.text(JSON.stringify(name1o));}
			else{fget.text(name1o.title);}
			
			fge.attr('action','getChildFolders');
		}
		
		fge = jQuery("*[action=getChildFolders']");
		if(fge && fge.length && fge.length>0 )
		{
			fge.attr('action','');
			var fgefc = fge.find("*[type='folderChilderen']");
			var qobj = {"q":" '"+fge[0].id+"' in parents "};
			var resp = sGetJSON(driveFilesUrl,qobj);
			fgefc.first().text(JSON.stringify(resp));
		}
		
	};
	
	var threadInt = setInterval(pthread, 1000);
	
} // end of class

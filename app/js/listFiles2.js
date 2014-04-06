/**
 * class: GoogleDriveClient
 * @param access_token
 * @returns
 */
function GoogleDriveClient(access_token) {
	
	window.rv={"_desc":"this is rv"};
	var setrv=function(n,v){window.rv[n]=v;};
	
	var driveFilesUrl = 'https://content.googleapis.com/drive/v2/files';
	var folderLinkUrl='https://drive.google.com/folderview?usp=drivesdk&id=';
	
	if ((!jQuery) || (!_)) {
		var error = 'Error: You must include jQuery and underscore to use this script.';
		alert(error);
		return error;
	}
	
	var addLinksToFolders = function()
	{
		var folderTitles = jQuery('.allFolderElements .folder-title');
		_.each(folderTitles,function(e){
			var ft = jQuery(e);
			var ftp = ft.parent();
			var nc = '<a target="_blank" href="'+folderLinkUrl+ftp.attr('data-folder-id')+'">';
			nc+=ft.html()+'</a>';
			ft.html(nc);
		});
	};
	this.p_addLinksToFolders = function(){addLinksToFolders();};
	
    var prependToEach=function(valuesToPrepend, originalArray)
    {
        var rtn = [];
        _.each(valuesToPrepend,function(e){
            var a1 = [];
             a1.push(_.clone(e));
            var a2 = a1.concat(_.clone(originalArray));
            rtn.push(a2);
        });
        return rtn;
    };
	
    /**
     * array of objects to html table
     **/
    var objectArrayToTable = function(o)
    {
        var rtn = '<table><tr>';
        var headers = _.unique(_.flatten(_.map(o,function(e){return _.keys(e);}),true)).sort();
        _.each(headers,function(o){rtn+='<th>'+_.escape(o)+'</th>';});
        rtn+='</tr>';
       
        _.each(o,function(oe){
            rtn+='<tr>'; 
            _.each(headers,function(o2){rtn+='<td>'+_.escape(
                _.isObject(oe[o2])?JSON.stringify(oe[o2]):oe[o2]
                                                            )+'</td>';});
            rtn+='</tr>';
        });
        rtn+='</table>';
        return rtn;
    };
	
	
	
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


    var getIdsFromUrl = function()
    {
        var rtn = [];
        var urlp = getUrlParams();
        if(urlp.state)
        {
            var state=JSON.parse(urlp.state);
            if(state.ids){ rtn=state.ids; }
        }
        return rtn;
    };
    
    var filterFoldersShown = function()
    {
    	jQuery("*[data-folder-ids]").slideUp(1); 
    	_.each(getIdsFromUrl(),function(e){jQuery("*[data-folder-ids*='"+e+"']").slideDown();});
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
	var getAllItems = function()
	{
		return _.flatten( _.map( allItemsPages , function(e){if(e.items){return e.items;}else{return [];}} ) , true);
	};
	this.p_getAllItems = function()
	{
		return getAllItems();
	};
	var getFolderElementsSorted=function()
	{
		var ii = 0;
		var all = [];
		var apa = getAllItems();
		var titles = _.pluck(apa,"title");
		var ids = _.pluck(apa,"id");
		var parentObjects = _.pluck(apa,"parents");
		var parents = _.map(parentObjects,function(parentObjectArray){
			return _.map(parentObjectArray,function(po){ return po.id; });
		});
		var idOfRoot = '';
		for(ii=0;(ii<parentObjects.length) && (idOfRoot=='');ii++)
		{
			var ij=0;
			for(ij=0;ij<parentObjects[ii].length;ij++)
			{
				if(parentObjects[ii][ij].isRoot){idOfRoot=parentObjects[ii][ij].id;}				
			}
		}
		var parentIdMap = _.map(ids,function(e,i){return {"id":e,"parentIds":parents[i]};});
		var idKeyParentIdsArrayMap={}; _.each(parentIdMap,function(d){idKeyParentIdsArrayMap[d.id]=d.parentIds;});
		var parentIdsAndIdsArrays = _.map(ids,function(e){return [e];});
		// while not everey array in parentIdsAndIdsArrays has first element of idOfRoot
		while(true)
		{
			var arrayBefore = JSON.stringify(parentIdsAndIdsArrays);
			for(ii=0;ii<parentIdsAndIdsArrays.length;ii++)
			{
				if(parentIdsAndIdsArrays[ii][0]!=idOfRoot)
				{
					var iii = 0;
					var pida = idKeyParentIdsArrayMap[parentIdsAndIdsArrays[ii][0]];
					var resa = _.clone(parentIdsAndIdsArrays[ii]);
					for(iii=0;iii<1 && iii<pida.length;iii++)
					{
						parentIdsAndIdsArrays[ii].unshift(_.clone(pida[iii]));
					}
					for(iii=1;iii<pida.length;iii++)
					{
						var resa2 = _.clone(resa);
						resa2.unshift(_.clone(pida[iii]));
						parentIdsAndIdsArrays.push(resa2);
					}
				}
			}
			var arrayAfter = JSON.stringify(parentIdsAndIdsArrays);
			if(arrayBefore==arrayAfter){break;}
		}
		// end while
		var allFolderIds = parentIdsAndIdsArrays;
		var allFolderTitles = _.map(parentIdsAndIdsArrays,function(a){
			return _.map(a,function(i){return titles[ids.indexOf(i)];});
		});
		var allFolderElements = [];
		_.each(allFolderIds,function(e,i){
			var fida = _.clone(e);
			var fta = _.clone(allFolderTitles[i]);
			var folderElementTitle = document.createElement('div');
			var folderElementChildren = document.createElement('div');
			folderElementTitle.className = 'folder-title';
			folderElementChildren.className = 'folder-children';
			
			var folderElement = document.createElement('div');
			
			folderElement.setAttribute('data-folder-id',_.last(fida));
			folderElement.setAttribute('data-folder-ids',fida.join(' '));
			// TODO: - use template to make a link for each folder title 
			var afesb = (fta.join('').toUpperCase());
			folderElement.setAttribute('data-folder-sortby',afesb);
			folderElementTitle.innerHTML=_.escape(fta.join(' / '));
			folderElement.appendChild(folderElementTitle);
			folderElement.appendChild(folderElementChildren);
			allFolderElements.push(folderElement);
		});
		var allFolderElementsAreSorted = _.sortBy(allFolderElements,function(e,i){return e.getAttribute('data-folder-sortby');});
		var allFolderElementsWrapper = document.createElement('div');
		allFolderElementsWrapper.className='allFolderElements';
		for(i=0;i<allFolderElementsAreSorted.length;i++){allFolderElementsWrapper.appendChild(allFolderElementsAreSorted[i]);}
		return allFolderElementsWrapper;
	};
	this.g_getFolderElementsSorted=function()
	{
		return getFolderElementsSorted();
	};

	
//	var ispageworking = false;
	var getNextPage = function(r,lastcb)
	{
		allItemsPages.push(r);
		if(r.nextLink)
		{
			getJSON(r.nextLink,function(r2){getNextPage(r2,lastcb);});
		}
		else
		{
			lastcb(allItemsPages);
		}
	};

	
	this.showChildrenFolders=function(lastcb)
	{
		var lastcb2 = function(d)
		{
			jQuery('.r').append(getFolderElementsSorted());
			if(getIdsFromUrl().length>0)
			{
				filterFoldersShown();
				//setTimeout(function(){addLinksToFolders();},2000);
				
			}
			else
			{
				alert('No folder ids were passed in. Please launch from google drive.')
			}
			//setrv('d',d); jQuery('.r').html(objectArrayToTable(_.flatten(_.map(d,function(i){return i.items;}),true)));
		};
		var q = {"q":"mimeType='application/vnd.google-apps.folder' "};
		getJSON(driveFilesUrl,function(r){getNextPage(r,lastcb2);jQuery('.search-form').slideDown();},false,q);		
	};
	
	

	var allSearchResultsPages = [];
	
	var getNextSearchResultsPage = function(r,lastcb)
	{
		allSearchResultsPages.push(r);
		if(r.nextLink)
		{
			getJSON(r.nextLink,function(r2){getNextSearchResultsPage(r2,lastcb);});
		}
		else
		{
			lastcb(allSearchResultsPages);
		}
	};

	var allSearchResultsItems = [];
	var getAllSearchResults=function(query,cb)
	{
		var lastcb2 = function(d,cb)
		{
			
			allSearchResultsItems=_.flatten(_.map(allSearchResultsPages,function(i){return i.items;}),true);
			jQuery('.r').html(objectArrayToTable(allSearchResultsItems));
		};
		if(cb){lastcb2=cb;}
		var q = {"q":""+query};
		getJSON(driveFilesUrl,function(r){getNextSearchResultsPage(r,lastcb2);},false,q);	
	};
	this.g_getAllSearchResults = function(query,cb)
	{
		return getAllSearchResults(query,cb);
	};
	this.search=function(query,lcb)
	{
		
		var cb = function(d)
		{
			window['rv']=[];
			var itemst = _.flatten(_.pluck(d,'items'),true);
			var itemsidsall = _.pluck(itemst,'id');
			var itemsids = _.unique(_.pluck(itemst,'id'));
			var items = [];
			_.each(itemsids,function(iid){items.push(itemst[itemsidsall.indexOf(iid)]);});
			window.rv.push({'itemst':itemst});
			window.rv.push({'itemsidsall':itemsidsall});
			window.rv.push({'itemsids':itemsids});
			window.rv.push({'items':items});
			var r = jQuery('.r');
			r.html('<div>'+items.length+' results found.</div>'+r.html());
			setTimeout(function(){
				window.googleDriveClient.getItemForEachParentId(window.rv[3].items);
			},2000);
			var elements = [];
			
			
		};
		if(lcb){cb=lcb;}
		return getAllSearchResults(query,cb);
	};
	
	this.getItemForEachParentId=function(items)
	{
		var i=0;
		var j=0;
		var rtn = [];
		for(i=0;i<items.length;i++)
		{
			var item = items[i];
			var parents = item.parents;
			for(j=0;j<parents.length;j++)
			{
				var parent = parents[j];
				var ca = {"itemid":"","parentid":"","title":""};
				ca.itemid=(_.clone(item.id));
				ca.parentid=(_.clone(parent.id));
				ca.title=(_.clone(item.title));
				rtn.push(ca);
				var e = jQuery('<div/>');
				e.attr('id',ca.itemid);
				e.attr('data-sr-document-parentid',ca.parentid);
				e.attr('class','sr-document');
				e.text(ca.title);
				jQuery("*[data-folder-id='"+ca.parentid+"'] .folder-children").append(e);
			}
			
		}
		return rtn;
	};
	
} // end of class

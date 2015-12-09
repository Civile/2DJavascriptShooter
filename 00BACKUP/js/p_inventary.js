2
/*
================================
player inventary
================================
*/



function __p_inventary()
{
	
	this.p_inventary = new Array();
	this.selItem = { val: null, id: new String(), descr: new String() };
	
	
	/*
	================
	Ajax save inventory
	================
	*/
	this.save = function(toLevel)
	{
		if( !this.p_inventary.length )
			return;
			
		var inventary = new String();
		var weapons   = new String();
		var level = toLevel;

		for (var index in this.p_inventary)
		{
		    inventary += this.p_inventary[index].id + ':';
		    inventary += this.p_inventary[index].val + ':';
		    inventary += this.p_inventary[index].descr;
		    inventary += ';';
		}
		
		for (var x in player.weapons) {
		    weapons += (x + ':');
		    weapons += player.weapons[x].ammo;
		    weapons += ';';
		}

		$.ajax({
		    type: "POST",
            async:false,
			url:"serverSide/g_saveLoad.php",
			data:"saveInventary=1&inventary=" + inventary + '&weapons=' + weapons + '&level=' + level + '&health=' + player.health,
			success: function(data)
			{
			    return true;
			}
		});
	}
	
	
	/*
	================
	Ajax load inventory
	================
	*/
	this.restore = function(currLevel)
	{
	    if (currLevel == null)
	        return null;

	    $('#loading').html('<p>restoring player status...</p>');
	    $.ajax({
	        url: 'serverSide/g_saveLoad.php',
	        type: 'POST',
            async:false,
	        data: 'loadInventary=1&level=' + currLevel,
	        success: function (data) {

	            if (!data)
	                return;

	            pData = JSON.parse(data);

	            player.health = parseInt(pData['health']);

	            if (pData['inventary'] != null)
	                for (var i in pData['inventary'])
	                    player.inventary.addItem(pData['inventary'][i]['item'], pData['inventary'][i]['value'], pData['inventary'][i]['description']);
	            if (pData['weapons'] != null)
	                for (var y in pData['weapons']) {
	                    w_addWeapon(player, pData['weapons'][y]['weaponId'], false);
	                    w_addAmmo(player, pData['weapons'][y]['weaponId'], pData['weapons'][y]['ammo']);
	                }
	        }
	    });
	}
	
	
	/*
	================
	Load and show inventory
	================
	*/
	this.loadInventary = function()
	{
		if( $('.inventary')[0] )
		{
			this.closeInventary();
			return false;
		}
		
		var invContent;
		//Init with content box
		var HTMLoutput = new String();
		
		HTMLoutput = '\
		<div id="inventary" class="inventary" style="visibility:hidden;"> \
			<div class="inventary title">\
				<div class="inventary titleDescr">Inventary</div> \
				<div style="clear"></div>\
			<div class="inventary contentBox">';
		
		//Load content
		invContent = this.getContent();
		if( !invContent.length )
			HTMLoutput = HTMLoutput.concat('<div class="inventory listBox" style="text-align:center; color:white; font-size:10px;"><span>empty</span></div>');
		else
			for( var index in invContent )
				HTMLoutput = HTMLoutput.concat('\
					<div class="inventory listBox" title="'+ invContent[index].descr +'">\
					<div class="inventary titleImage"><img src="src/items/'+ invContent[index].id +'.png"></div>\
					<div class="inventary titleDescr"><span class="description">'+ invContent[index].descr +'</span></div>\
					<div class="inventary titleValue"><span class="value">'+ invContent[index].val +'</span></div>\
					</div>');
		
		//Weapons's list
		HTMLoutput = HTMLoutput.concat('</div><div class="pinfo"><div style="float:left;">&nbsp;');
		for( var i in player.weapons )
			HTMLoutput = HTMLoutput.concat('<img src="src/'+ player.weapons[i].sprite+'" width="12px" height="12px" style="margin-right:5px;" align:center; title="'+player.weapons[i].name+' ammo:'+player.weapons[i].ammo+' [button '+i+']">');
		HTMLoutput = HTMLoutput.concat('</div>&nbsp;');
		
		//Points
		HTMLoutput = HTMLoutput.concat('<div style="float:right;" title="Points">Points: ' + player.points + '&nbsp;</div></div></div></div>');
		
		//Append inventary div
		$('#window').append(HTMLoutput);
		$('#inventary').css('visibility', 'visible').hide().fadeIn();
		$('#game').css('opacity', '0.7');
		
		$('#objective').animate({left: 240}, 500);
		$('#hud').animate({ left: 250 }, 500);

		s_loadSoundHandler('P_INV_OPEN', null);
		this.appendListener();
	}
	
	
	
	
	
	/*
	================
	Reload list's element
	================
	*/
	this.reload = function(listElement)
	{
		return $(listElement).find('span.value').text( Number($(listElement).find('span.value').text()) - 1);
	}
	
	
	
	
	/*
	================
	Close inventary
	================
	*/
	this.closeInventary = function()
	{
		$('#game').css('opacity', '1');
		$('#inventary').fadeOut(200).html('');
		$('#objective').animate({ left: 15 }, 500);
		$('#hud').animate({ left: 15 }, 500);
		setTimeout(function() { $('#inventary').remove(); }, 280);
	}
	
	
	
	
	
	/*
	================
	Inventary listener
	================
	*/
	this.appendListener = function()
	{
		var _self = this;
		//element's click listener
		$('.listBox').click(function()
		{
			_self.selItem.value = $(this).find('span.value').text();
			_self.selItem.descr = $(this).find('span.description').text();
			_self.selItem.id = $(this).find('img').attr('src');
			
			usedItem = _self.useItem(_self.selItem);
			//alert(usedItem.val);
			if( usedItem.val <= 0  )
			{
				_self.removeItem(usedItem.id);
				$(this).slideUp('fast');
				return;
			}
			else
			{
				$(this).animate({opacity: '0.1'},100).animate({opacity: '1'},150);				
				_self.reload(this);
				return;
			}
			
		});
		return;
	}
	
	
	
	
	
	
	/*
	================
	Use an item
	================
	*/
	this.useItem = function(item)
	{
		var splittedSrc = this.selItem.id.split('/');
		var id = splittedSrc[2].replace('.png','');
		
		switch (id)
		{
			case 'healthBox':
				if( c_returnHealth( player ) < 100 )
				{
					c_setHealth(player, 10);
					return this.decrementItem(id);
				}
			break;
		}
		return;
	}
	
	
	
	
	/*
	================
	Decrement the value of an item 
	================
	*/
	this.decrementItem = function(id)
	{
		var itemToUpdate = this.searchItemById(id);
		itemToUpdate = this.updateItem(id, itemToUpdate.val-1);
		return itemToUpdate;
	}
	
	
	
	
	/*
	================
	Remove item from inventory
	================
	*/
	this.removeItem = function(id)
	{
		for( var index in this.p_inventary )
			if( this.p_inventary[index].id == id )
				this.p_inventary.splice(index, 1);
	}
	
	
	
	
	/*
	================
	Search an item
	================
	*/
	this.searchItemById = function(lookingForItem)
	{
		for( var index in this.p_inventary )
			if( this.p_inventary[index].id == lookingForItem )
				return this.p_inventary[index];
		return null;
	}
	
	
	/*
	================
	Load inventary content
	================
	*/
	this.getContent = function()
	{
		return this.p_inventary;
	}
	
	
	
	
	/*
	================
	Add item
	================
	*/
	this.addItem = function(newItemId, newItemValue, newItemDescription)
	{
		if( !this.searchItemById(newItemId))
		{
			var newItem = {id:newItemId, val:parseInt(newItemValue), descr:newItemDescription};
			this.p_inventary.push(newItem);
			
		}
		else
		{
			var item = this.searchItemById(newItemId)
			this.updateItem(newItemId, item.val+1);
		}

	}	
	
	
    /*
    ================
    Show popup message
    ================
    */
	this.popUpMsg = function (img, text) {

	    var msgId = $('#popups').size();

	    $('#popups').append('<div class="infoPopUp" id="'+msgId+'">'+text+'<div style="display:inline-block;"><img src="' + img + '"/></div></div>');

	    setTimeout(function () {
	        $('#' + msgId).remove();
	    }, 5000);
	}



	
	/*
	================
	Update existing item
	================
	*/
	this.updateItem = function(itemId, newValue)
	{
		if( !this.p_inventary.length )
			return false;
		
		for( var index in this.p_inventary )
			if( this.p_inventary[index].id == itemId )
			{
				this.p_inventary[index].val = newValue;
				return this.p_inventary[index];
			}
		return false;
	}
}
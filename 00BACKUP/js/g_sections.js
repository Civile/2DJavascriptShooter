/*
==========================================
SECTIONS | TREE
==========================================
*/


function __sections()
{
	this.map = { width: null, height: null };
	
	this._TEST = 0;

	this.nSections = 12;			
	this.sections = new Array();	
	this.singleSectionWidth;		
	this.solidObjs = gameElements;	
	this.totElements = 0;


	/*
	=====================
	Divides map
	=====================
	*/
	this.construct = function()
	{
		//Get map dimension
		this.map.width = 8000;  //standard width of a map
		this.map.height = 430;  //standard height of a map
		
		this.singleSectionWidth = (this.map.width / this.nSections);

		for( var i = 0; i  <= this.nSections; i++ )
		{
		    this.sections[i] = { lx: (i * this.singleSectionWidth), rx: ((i * this.singleSectionWidth) + this.singleSectionWidth), objs: null };
		    this.sections[i].objs = new Array();
        }
		return true;
	}
	
	
    /*
    =====================
    Empty
    =====================
    */
	this.destruct = function () {
	    return this.sections = new Array();
	}


    /*
    =====================
    Add bounding box
    =====================
    */
	this.addBox = function (x, y, width, height, type, id, interactions, plane) {

	    var zoneIndex = this.getZoneByX(x);
	    var box = new Object();

        //New bounding box
	    box.xpos            = parseInt(x);
	    box.ypos            = parseInt(y);
	    box.width           = parseInt(width);
	    box.height          = parseInt(height);
	    box.type            = type;
	    box.id              = id;
	    box.plane           = parseInt(plane);
	    box.px              = new Physix();

        //Add interaction properties
	    if (interactions) 
	        for (var prop in interactions)
	            if (interactions.hasOwnProperty(prop))
	                box[prop] = interactions[prop];

        if (!this.sections[zoneIndex])
            return;


        //NEW
        if (!this.sections[zoneIndex].objs[type])
            this.sections[zoneIndex].objs[type] = new Array();

        this.sections[zoneIndex].objs[type].push(box);

        //...this sheet is used for rendering too

        if(type != 'monster' && type != 'item' && type != 'door' && type != 'decor')
            if (this.getZoneByX(box.xpos + box.width) != zoneIndex)
	            this.addBox(this.sections[zoneIndex].rx,
                    y,
                    box.width - (this.sections[zoneIndex].rx - box.xpos),
                    height,
                    type,
                    id,
                    interactions,
                    plane, true);
	}



    /*
    =====================
    Remove element
    =====================
    */
	this.remove = function (object) {

	    var sector = this.getZoneByX(object.xpos);
	    if (this.sections[sector].objs[object.type])
	        var indexOf = this.sections[sector].objs[object.type].indexOf(object);

        if(indexOf != -1)
	        this.sections[sector].objs[object.type].splice(indexOf, 1);

        
	}


    /*
    =====================
    Move/add
    =====================
    */
	this.move = function (object) {
	    this.remove(object);
	    this.add(object);
	}

	this.add = function (object) {
	    this.addBox(object.xpos, object.ypos, object.width, object.height, object.type, object.id, object.plane);
	}



    /*
    =====================
    Sector existence
    =====================
    */
	this.sectorExists = function (zoneIndex) {
	    return this.sections[zoneIndex] != null ? true : false;
	}

	this.createSector = function (zoneIndex) {
            this.sections[zoneIndex] = new Array();
	        return this.sections[zoneIndex].objs = new Array();
	}



    /*
    =====================
    Get object sector
    =====================
    */
	this.getZoneByX = function (elementLXPos) {
	    return Math.floor(elementLXPos / this.singleSectionWidth);
	}



    /*
    =====================
    Get objects (objsList array) in the zoneIndex zone
    =====================
    */
	this.retrieveObjs = function (zoneIndex, objsList) {

	    if (!objsList)
	        return null;

	    var merg = new Array();

        var objsRequested = new Array();

	    if (!this.sections[zoneIndex])
	        return null;

	    for (var i = 0; i <= objsList.length; i++) {
	        if (this.sections[zoneIndex].objs[objsList[i]]) 
	            objsRequested.push(this.sections[zoneIndex].objs[objsList[i]]);
	    } 
	    if (this._TEST)
	        render.renderRect_ext(this.sections[zoneIndex].lx, 0, 1, 430, 'red');

	    return merg.concat.apply(merg, objsRequested);
	}


    /*
    =====================
    Return objects beetween n sections
    =====================
    */
	this.retrieveObjs_ext = function (startSection, endSection, objClasses, sort) {

	    var objsTaken = new Array();
	    var objs = new Array();

	    if (startSection == endSection)
	        return this.retrieveObjs(startSection, objClasses);

	    //Get objects beetween 2 or more sections
	    for (var i = startSection; i <= endSection; ++i) 
	        objs.push(this.retrieveObjs(i, objClasses));

	    //Merge result into a single array
	    var merged = new Array();

        if (sort)
            return this.sortBy(merged.concat.apply(merged, objs), sort);
        else return merged.concat.apply(merged, objs);

	}


    /*
    =====================
    Return tot sections
    =====================
    */
	this.getTotSections = function () {
	    return this.nSections;
	}



    /*
    =====================
    Sort an objarray by property
    =====================
    */
	this.sortBy = function (objarray, property) {

	    if (!objarray || !property)
	        return null;

	    return objarray.sort(function (a, b) {

	        if (!a || !b)
	            return 0;

	        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	    });
	}


    /*
    =====================
    Sort all the sectors array
    =====================
    */
	this.sortAll = function (property) {
	    for (var i in this.sections)
	        for (var c in this.sections[i].objs)
	            this.sections[i].objs = this.sortBy(this.sections[i].objs, property);
	}




    /*
	=====================
	Add element
	=====================
	*/
	this.addElement = function (zoneIndex, element)
	{
	    if (!element)
	        return;

	    if (!this.sections[zoneIndex].objs[element.type])
	        this.sections[zoneIndex].objs[element.type] = new Array();

	    this.sections[zoneIndex].objs[element.type].push(element);

	    return zoneIndex;
	}




    /*
	=====================
	Move an element
	=====================
	*/
	this.moveElement = function (lastZone, newZone, element, elId)
	{
	    if (!element)
	        return;
        
	    var index = null;

	    if (newZone == -1)
	        newZone = 0;

	    if (this.sections[lastZone] != null) {
	        index = this.sections[lastZone].objs[element.type].indexOf(element);
	        if (index == -1)
	            return false;
	        this.sections[lastZone].objs[element.type].splice(index, 1);
	    }
	    if (this.sections[newZone] != null) {
	        if (!this.sections[newZone].objs[element.type])
	            this.sections[newZone].objs[element.type] = new Array();
	        this.sections[newZone].objs[element.type].push(element);
	    }
	}


	
    /*
    =====================
    Remove an element
    =====================
    */
	this.removeElement = function (zoneIndex, element)
	{
	    if (!element)
	        return;
	    
	    if (this.sections[zoneIndex] == null)
	        return;

	    var index = this.sections[zoneIndex].objs.indexOf(element);
	    if (index == -1)
	        return;

	    this.sections[zoneIndex].objs.splice(index, 1);
	}
}





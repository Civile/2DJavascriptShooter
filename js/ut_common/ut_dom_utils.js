

/*
===================================================
Jquery common utils, DOM handlers...
===================================================
*/

//UNDER OPTIMIZATION



/*
=====================
Get HTMLobj attr
=====================
*/
function ut_HTMLgetAttr(HTML_object, attrName) {
    if (!HTML_object || !$(HTML_object)[0] || !attrName)
        return null;
    return $(HTML_object).attr(attrName);
}



/*
=====================
Remove object from DOM
=====================
*/
function ut_HTMLremoveObj(object) {
    if (!object || !$(object)[0])
        return null;
    return $(object).remove();
}



/*
=====================
Return obj.width
=====================
*/
function ut_width(object)
{
    if (!object || !$(object)[0])
        return null;
    return $(object).width();
}


/*
=====================
Update width
=====================
*/
function ut_HTMLchangeWidth(object, newWidth)
{
    if (!object || !$(object)[0] )
        return null;
    return $(object).width(parseInt(newWidth));
}


/*
=====================
Return obj.height
=====================
*/
function ut_HTMLheight(object)
{
    if (!object || !$(object)[0])
        return null;
    return $(object).height();
}




/*
=====================
Print some text
=====================
*/
function ut_HTMLprintstr(destinationId, text, color)
{
    if ( !destinationId )
        return false;

    return $(destinationId).text(text);
}
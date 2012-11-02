/**
 * @author ZENG
 */
var num=0;
var chrstr="chrome://favicon/";
var t;
/*<td width = 20%>
 <button id="add">添加书签</button>
 </td>
 <td >
 <input type="text" id="markName"/>
 </td>*/
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("add").addEventListener("click",clickAdd);
    document.getElementsByTagName("input")[0].addEventListener("keypress",input);
    refresh();
});

function input(e){
    if(e.charCode==13)
    {
        clickAdd(e);
    }
}
function createHtml(item,u){
    var title = item.title;
    var url = u;
    var Y =parseInt(item.Y);
    var a = document.createElement("a");
    a.href = "";
    a.title = u;

    var img = document.createElement("img");
    var div = document.createElement("div");
    var span = document.createElement("span");

    img.src = chrstr+url;
    img.alt = url;

    div.innerHTML = title;

    span.className = "delbutton";
    span.innerHTML = "X";

    a.appendChild(img);
    a.appendChild(div);
    a.appendChild(span);
    return a;
}

function clickA(e){
    t = e;
    var url = e.target.parentElement.title;
    if(e.target.tagName=="DIV" || e.target.tagName=="IMG"){
        Jump(url);
    }
    else{
        Del(url);
    }

}
function Jump(url){
    var Y = JSON.parse(localStorage["list"])[url].Y;
    var index = 99999;
    //alert("url:"+url+"||index:"+index+"||Y:"+Y);
    chrome.tabs.create({"url": url, "index": index,"selected":true});

    chrome.tabs.executeScript(null,
        {code:"window.scrollTo(0,"+Y+")"});
    window.close();
}
function Del(url){
    var list = JSON.parse(localStorage["list"]);
    if(list[url])
    {
		num--;
		list.num = num;
        refresh();
        delete list[url];
        localStorage["list"] = JSON.stringify(list);
        Renew("Delete successfully.");
    }
    Renew( "URL no exist.");


}
//点击添加网页，网址如果已存在，则要添加并删除。
function clickAdd(e){
    chrome.tabs.getSelected(null, function(tab) {
        var rr = new Object();
        var url = tab.url;
        var title = tab.title;
        var title2 = document.getElementsByTagName("input")[0].value;
        if(title2 =="" )
            rr.title = title;
        else
        {
            rr.title = title2;
            document.getElementsByTagName("input")[0].value = "";
        }


        chrome.tabs.executeScript( null, {code:"window.scrollY;"},
            function(results){
                var Y=results[0];
                rr.Y = Y;
                var list =JSON.parse( localStorage["list"] );
                var str;
                if(list[url]){ //页面已存在
                    list[url] = rr;
                    str = JSON.stringify(list);
                    Renew("URL already exist,refresh successfully.");

                }
                else{  //不存在
                    num++;
					list.num = num;
                    list.asdfghjkl=rr;
                    str = JSON.stringify(list).replace("asdfghjkl",url);
                    Renew("Add a new URL successfully.");
                }


                localStorage["list"] = str;
                refresh();

            } );

    });
    /*chrome.tabs.sendMessage(tab.id, {"greeting": "hello"}, function(response) {
     alert(JSON.stringify(response));
     var url = response.url;
     var title = response.title;
     var Y =   response.Y;
     var rr = new Object();
     var title2 = document.getElementsByTagName("input")[0].value;

     if(title2 =="" )
     rr.title = title;
     else
     {
     rr.title = title2;
     document.getElementsByTagName("input")[0].value = "";
     }



     });*/
    /*
     var b = new Object();
     b.title = "jandan.net/";
     b.Y = 288;
     var l = new Object();
     l["http://jandan.net/"] = b;
     l["num"]=1;
     localStorage["list"] = JSON.stringify(l)
     */

}
function Renew(text){
    document.getElementsByClassName("stats")[0].innerHTML = text;
    setTimeout(function(){
        document.getElementsByClassName("stats")[0].innerHTML ="";
    },1800);
}
function refresh(){
	
    var list = JSON.parse(localStorage["list"]);
    if(list && list.num){
		num =0;
        var content = document.getElementById("content");
        content.innerHTML = null;
        for(var item in list){
            if(item=="num")
                continue;
			num++;
            var itemhtm = createHtml(list[item],item);
            content.appendChild(itemhtm);
        }
        var as = document.querySelectorAll('a');
        for (var i = 0; i < as.length; i++) {
            as[i].addEventListener("click",clickA);
        }

    }
    else{
        list = new Object();
        list.num = 0;
        localStorage["list"] = JSON.stringify(list);
    }
}
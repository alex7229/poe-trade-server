/*
$.ajax({
    method: 'post',
    url: '/api/proxy',
    data: {
        'url': 'some url very long'
    }
})
.done((response) => {
    console.log(response)
});*/


function itemParse (tbody) {




    debugger;


    function findAttr (attr, tag = 'tbody', html = tbody) {
        const regExp = new RegExp('<' + tag + '[^>]*' + attr + '="([\s\S]*])"[^>]*>', 'i');
        let data = html.match(regExp);
    }

    findAttr('id', 'tbody', `<tbody id="item-container-6" class="item item-live-e424e4e5f7f3602a057f88ba9f396a69"></tbody>`);






    const item = tbody;

    const oldRegExp = /tbody id="item-container-(\d*)"[\s\S]*data-buyout="([^"]*)"[\s\S]*data-ign="([^"]*)"[\s\S]*data-name="([^"]*)"[\s\S]*data-tab="([^"]*)"[\s\S]*data-x="(-?\d*)"[\s\S]*data-y="(-?\d*)"/;

    const generalRegExp = /tbody id="item-container-(\d*)"[\s\S]*data-buyout="([^"]*)"[\s\S]*data-ign="([^"]*)"[\s\S]*data-name="([^"]*)"[\s\S]*data-tab="([^"]*)"/;
    const time = item.match(/<span class="found-time-ago">([^<]*)<\/span>/)[1];
    const id = item.match(/tbody id="item-container-(\d*)"/)[1];



    return {
        time: item.match(/<span class="found-time-ago">([^<]*)<\/span>/)[1],
        id: item.match(/tbody id="item-container-(\d*)"/)[1],
        price: item.match(/tbody[^>]+(?:data-buyout=)/)
    };





    const mainItemData = item.match(generalRegExp);

    return {
        time,
        id: mainItemData[1],
        price: mainItemData[2],
        userName: mainItemData[3],
        itemName: mainItemData[4],
        tabName: mainItemData[5],
        tabPositionX: mainItemData[6],
        tabPositionY: mainItemData[7]
    };
}


console.log(itemParse(`<tbody id="item-container-6" class="item item-live-e424e4e5f7f3602a057f88ba9f396a69" data-seller="Garlicsoap"
data-thread="1933570"
data-sellerid="931030"
data-buyout=""
data-ign="Garlicsoap"
data-league="Harbinger"
data-name="Queen of the Forest Destiny Leather"



    data-x="-1"
    data-y="-1"
> <tr class="first-line"> <td class="icon-td"> <div class="icon"><img src="https://web.poecdn.com/image/Art/2DItems/Armours/BodyArmours/QueenoftheForest.png?scale=1&amp;w=2&amp;h=3&amp;v=ac2e9dc46d24d5e46ff5a10d68ae819a3" alt="Item icon">
<div class="sockets" style="position: absolute;">
    <div class="sockets-inner" style="position: relative; width:94px;">
        <div class="socket socketD "></div><div class="socketLink socketLink0"></div><div class="socket socketS "></div><div class="socketLink socketLink1"></div><div class="socket socketI socketRight"></div><div class="socketLink socketLink2"></div><div class="socket socketD socketRight"></div><div class="socketLink socketLink3"></div><div class="socket socketD "></div><div class="socket socketI "></div>
    </div>
</div></div> </td> <td class="item-cell"> <h5><a class="title itemframe3" target="_blank" href="http://www.pathofexile.com/forum/view-thread/1933570">  Queen of the Forest Destiny Leather </a> <span class="found-time-ago">10 hours ago</span>  <a target="_blank" class="wiki-link" href="http://pathofexile.gamepedia.com/Queen of the Forest">[wiki]</a>  </h5> <ul class="requirements proplist">     <li>Level:&nbsp;59</li>  <li>Dexterity:&nbsp;160</li>      <li><span class="sortable" data-name="ilvl">ilvl: 71</span></li>
<li><span data-tooltip class="has-tip " title="
    You can obtain up to 6 sockets with Jeweller's orbs.<br>
    Vorici can craft up to 6 sockets on this item.
">Max sockets: 6 (6)</span></li>
  </ul> <span style="display:none" class="sockets-raw">G-R-B-G-G B</span> <ul class="item-mods"><li class="bullet-item"><ul class="mods"><li class="sortable " data-name="##% increased Evasion Rating" data-value="335.0" style=""><b>335</b>% increased Evasion Rating</li><li class="sortable " data-name="#+# to maximum Life" data-value="68.0" style="color:#D14E4E">+<b>68</b> to maximum Life</li><li class="sortable " data-name="#+#% to Fire Resistance" data-value="8.0" style="color:#B97123">+<b>8</b>% to Fire Resistance</li><li class="sortable " data-name="#+#% to Cold Resistance" data-value="29.0" style="color:#3F6DB3">+<b>29</b>% to Cold Resistance</li><li class="sortable " data-name="#+#% to Lightning Resistance" data-value="18.0" style="color:#ADAA47">+<b>18</b>% to Lightning Resistance</li><li class="sortable " data-name="##% reduced Movement Speed" data-value="25.0" style=""><b>25</b>% reduced Movement Speed</li><li class="sortable " data-name="##% increased Movement Speed per # Evasion Rating" data-value="225.5" style=""><b>1</b>% increased Movement Speed per <b>450</b> Evasion Rating</li><li class="" data-name="#-48 Physical Damage taken when Hit by Animals" data-value="0" style="">-48 Physical Damage taken when Hit by Animals</li></ul></li></ul>  </td> <td class="table-stats"> <table> <tr class="calibrate">  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  <th></th>  </tr>  <tr class="cell-first">   <th colspan="2" >  Quality  </th>  <th colspan="2" class="disabled">  Phys.  </th>  <th colspan="2" class="disabled">  Elem.  </th>  <th colspan="2" class="disabled">  APS  </th>  <th colspan="2" class="disabled">  DPS  </th>  <th colspan="2" class="disabled">  pDPS  </th>  <th colspan="2" class="disabled">  eDPS  </th>  </tr> <tr class="cell-first">      <td colspan="2" data-name="q" data-value="20" class="sortable property "   >  20  </td>        <td colspan="2" data-name="quality_pd" data-value="0.0" class="sortable property "   >    </td>     <td colspan="2" data-name="ed" data-value="0.0" class="sortable property "   data-ed=""  >    </td>     <td colspan="2" data-name="aps" data-value="0" class="sortable property "   >  &nbsp;  </td>        <td colspan="2" data-name="quality_dps" data-value="0.0" class="sortable property "   >  &nbsp;  </td>        <td colspan="2" data-name="quality_pdps" data-value="0.0" class="sortable property "   >  &nbsp;  </td>     <td colspan="2" data-name="edps" data-value="0.0" class="sortable property "   >  &nbsp;  </td>  </tr>   <tr class="cell-second">  <th class="cell-empty"></th>   <th colspan="2" class="disabled">  Armour  </th>  <th colspan="2" >  Evasion  </th>  <th colspan="2" class="disabled">  Shield  </th>  <th colspan="2" class="disabled">  Block  </th>  <th colspan="2" class="disabled">  Crit.  </th>  <th colspan="2" class="disabled">  Level  </th>  </tr> <tr class="cell-second">  <td class="cell-empty"></td>         <td colspan="2" data-name="quality_armour" data-value="0.0" class="sortable property "   >  &nbsp;  </td>        <td colspan="2" data-name="quality_evasion" data-value="2735.0" class="sortable property "   >  2735  </td>        <td colspan="2" data-name="quality_shield" data-value="0.0" class="sortable property "   >  &nbsp;  </td>     <td colspan="2" data-name="block" data-value="0" class="sortable property "   >  &nbsp;  </td>     <td colspan="2" data-name="crit" data-value="0" class="sortable property "   >  &nbsp;  </td>     <td colspan="2" data-name="level" data-value="0" class="sortable property "   >  &nbsp;  </td>  </tr>   </table> </td> </tr> <tr class="bottom-row"> <td class="first-cell"></td> <td> <span class="requirements">  <ul class="proplist">   <li><span class="click-button" data-thread="1933570" data-hash="7f91352521ba3ddb47e7d1c9ea989c29" onclick="verify_modern(this)">Verify</span></li>   <li><span class="success label">online</span> IGN: Garlicsoap</li>     <li><a href="#" onclick="sendPM(this);return false">PM</a></li>    <li><a href="#" onclick="return false" class="whisper-btn">Whisper</a></li>  </ul> </span> </td> <td colspan="16" class="third-cell"></td> </tr> <tr><td colspan="16" class="item-separator"></td></tr> </tbody>`));



/*
$.ajax({
    method: 'post',
    url: '/api/proxy',
    data: {
        'url': `http://poe.trade/search/ahosetomookasi`
    }
})
    .done((response) => {
        documentParse(response)
    });




function documentParse(htmlData) {
    const regExp = /<tbody[\s\S]*<\/tbody>/ig;
    debugger;

}*/

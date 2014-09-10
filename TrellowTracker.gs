function trelloFetch(url) {
  var key = "[your key here]";
  var token = "[your token here]";
  var completeUrl = "https://api.trello.com/1/" + url + "?key=" + key + "&token=" + token;
  var jsondata = UrlFetchApp.fetch(completeUrl);
  var object = Utilities.jsonParse(jsondata.getContentText());
  return object;
}

function getBoardListCount(first) {
  var boardid = "[your boardid here]";
  var url_lists = "board/" + boardid +"/lists";
  var trello_lists = trelloFetch(url_lists);

  var lists = [];
  var listnames = ["Name"];
  var listcounts = [];
  var acountlist = ["[Name of Employee1]"];
  var ncountlist = ["[Name of Employee2]"];

  for (var i = 0; i < trello_lists.length; i++) {
    var listid = trello_lists[i].id;
    var url_cards = "lists/" + listid +"/cards";
    var trello_cards = trelloFetch(url_cards);
    var count = 0;
    var acount = 0;
    var ncount = 0;
    var undefinedcount = 0;


    for (var j = 0; j < trello_cards.length; j++) {
      count++;
      if (trello_cards[j].idMembers == "[employee1 member id]") {
        acount++;
       }
      else if (trello_cards[j].idMembers == "[employee2 member id]") {
        ncount++;
       }
      else {
        undefinedcount++;
       }
    }    

    listnames[i+1] = trello_lists[i].name;
    listcounts[i] = count;
    acountlist[i+1] = acount;
    ncountlist[i+1] = ncount;
    var nsum = 0;
    var asum = 0;
    var adoingsum = acountlist[2];
    var ndoingsum = ncountlist[3];
      for (var x = 1; x < acountlist.length; x++){
        asum += acountlist[x];
      }
      for (var y = 1; y < ncountlist.length; y++){
        nsum += ncountlist[y];
      }
      
    
  
  }
acountlist.push(adoingsum);
ncountlist.push(ndoingsum);
acountlist.push(asum);
ncountlist.push(nsum);
outof = nsum + asum;
acountlist.push(outof);
ncountlist.push(outof);


  if (first) {
    lists[0] = listnames;
    lists[1] = acountlist;
    lists[2] = ncountlist;
  }
  else {
    lists[0] = acountlist;
    lists[1] = ncountlist;
  }
  return lists;  
}

function getValues() {
  var data;
  var sheet = SpreadsheetApp.getActiveSheet();
  var counter = sheet.getRange(1, 10);
  var baserow = counter.getValue() + 2;
  var basecolumn = 2;

  sheet.getRange(baserow+1, basecolumn - 1).setValue(new Date());
  sheet.getRange(baserow +2, basecolumn - 1).setValue(new Date());
  if (counter.getValue() == 0) {
    data = getBoardListCount(true);
    sheet.getRange(baserow -1, basecolumn, 2, 6).setValues(data);
  }
  else {
    data = getBoardListCount(false);
    Logger.log(data);
    sheet.getRange(baserow + 1, basecolumn, 2, 8).setValues(data);
  }

  counter.setValue(counter.getValue()+2);
}

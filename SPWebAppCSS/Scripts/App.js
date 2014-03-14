'use strict';

var context = SP.ClientContext.get_current();
var web = context.get_web();
var user = web.get_currentUser();
var oListItem;
var allLists;

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function() {

    allLists = web.get_lists();
    context.load(web);
    context.load(allLists);

    context.executeQueryAsync(onGetListsSucceeded, onGetUserNameFail);

    getUserName();
});


function onGetListsSucceeded() {

    var ulist = $('#message').append('<ul></ul>').find('ul');
    for (var i = 0; i < allLists.get_count() ; i++) {
        var singleList = allLists.getItemAtIndex(i);
        var prop = singleList.get_title();
        var itemCount = singleList.get_itemCount();
        //var view = singleList.get_defaultView();
        ulist.append('<li>' + itemCount + '  <a href="' + web.get_url() + '/Lists/' + prop + '/AllItems.aspx">' + prop + '</a></li>');
    }
}

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

function CreateSPTask() {
    var taskList = web.get_lists().getByTitle("apptasks");
    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = taskList.addItem(itemCreateInfo);

    oListItem.set_item('Title', 'My New Task!');
    oListItem.set_item('Body', 'Hello World!');

    oListItem.update();

    context.load(oListItem);

    context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));

}
function onQuerySucceeded() {

    alert('Item created: ' + oListItem.get_id());
}

function onQueryFailed(sender, args) {

    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
// This function is executed if the above call is successful
// It replaces the contents of the 'message' element with the user name
function onGetUserNameSuccess() {
    $('#message').text('Hello ' + user.get_title() + user.get_email());
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}

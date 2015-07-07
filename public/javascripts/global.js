// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $('#sessionList table tbody').on('click', 'td a.linkshowsession', showSessionInfo);
    $('#btnCreateSession').on('click', createSession);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteSession);
    $('#serverlist').change(function() {
       populateTable();
    });
    $('#btnCreateUser').on('click', createUser);
    $('#btnLogin').on('click', login);
    if (username) {
        $('#btnOwnSessions').on('click', username);
    }
});

// Functions =============================================================

function populateUserTable() {
    
};

// Fill table with data
function populateTable(username) {

    username = typeof username !== 'undefined' ? username : '';

    // Empty content string 
    var tableContent = '';
    server = $('#serverlist option:selected').text();
    // jQuery AJAX call for JSON
    if (username != '') {
        url = '/session/sessionlist/' + username;
    } else {
        url = '/session/sessionlist/' + server;
    }
    $.getJSON(url , function( data ) {
        if (data.length == 0) {
            if (username != '') {
                tableContent += '<tr><td class="noSessions" colspan="3">You have no active sessions.</td></tr>';
            } else {
                tableContent += '<tr><td class="noSessions" colspan="3">No active sessions for this server.</td></tr>';
            }
        }
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="/party/' + this._id + '">' + this.server + '</a></td>';
            tableContent += '<td>' + this.instance + '</td>';
            if (1) {
                tableContent += '<td>' + this.leader + '</td>';
            }
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#sessionList table tbody').html(tableContent);
    });
};

function showSessionInfo(event) {
    event.preventDefault();
    var thisID = $(this).attr('rel');
    var tableContent = ''
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisID);
    console.log(userListData);
    var thisSessionObject = userListData[arrayPosition];
   
    $.getJSON('/session/userlist/' + thisID, function(data) {
        $.each(data, function() {
           //tableContent 
        });
    });
    
    $('#sessionInfo table tbody').html(tableContent)
    
};

function createUser(event) {
    event.preventDefault();
    
    var errorCount = 0;
    
    $('#createSession input').each(function(index, val) {
       if ($(this).val() == '') { errorCount++; } 
    });
    
    pswd = $('#createSession fieldset sinput#inputPassword').val();
    pswd_r = $('#createSession fieldset sinput#reinputPassword').val()
    
    if (errorCount === 0 && pswd === pswd_r) {
        var newUser = {
            'username': $('#createSession fieldset input#inputUserName').val(),
            'password': $('#createSession fieldset input#inputPassword').val(),
            'charname': $('#createSession fieldset input#inputCharName').val()
        }
        
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/register/createuser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                window.location.replace('../');
            } else {
                alert('Error: ' + response.msg);
                $('#createSession fieldset input').val('');
            }
        });
    } else {
        return false;
    }
};

function login(event) {
    event.preventDefault();
    
    var errorCount = 0;
    $('#createSession input').each(function(index, val) {
        if ($(this).val() == '') { errorCount++;}
    });
    
    if (errorCount === 0) {
        var credentials = {
            'username': $('#createSession fieldset input#inputUserName').val(),
            'password': $('#createSession fieldset input#inputPassword').val()
        }
        
        $.ajax({
            type: 'POST',
            data: credentials,
            url: '/login/processlogin',
            dataTyupe: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                window.location.replace('../');
            } else {
                alert('Error: ' + response.msg);
                $('#createSession fieldset input#inputPassword').val('');
            }
        });
    } else {
        return false;
    }
};

// Add User
function createSession(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#createSession input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newSession = {
            'server': $('#createSession fieldset select#inputServerName option:selected').text(),
            'instance': $('#createSession fieldset select#inputInstanceName option:selected').text()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newSession,
            url: '/session/createsession',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#createSession fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteSession(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

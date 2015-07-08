// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    //('#sessionList table tbody').on('click', 'td a.linkshowsession', showSessionInfo);
    $('#btnCreateSession').on('click', createSession);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteSession);
    $('#serverlist').change(function() {
       populateTable();
    });
    $('#btnCreateUser').on('click', createUser);
    $('#btnLogin').on('click', login);
    if (typeof user != 'undefined') {
        $('#btnOwnSessions').on('click', function() {
            if ($('#btnOwnSessions').text() == "your sessions") {
                $('#btnOwnSessions').html('all sessions');
                populateTable(user);
                $('#header').html("Your Sessions");
            } else {
                $('#btnOwnSessions').html('your sessions');
                populateTable();
                $('#header').html("Session List");
            }
        });
    }
    populateUserTable();
    $('#btnUpdate').on('click', update);
});

function populateUserTable() {
    var tableContent = '';
    id = window.location.href.split("/")[4];
    
    $.getJSON('/party/memberlist/' + id, function(data) {
        var i = 0;
        $.each(data, function() {
           i++;
           tableContent += '<tr><td><input id="name' + i + '" input type="text" value="' + (typeof data['name'] != 'undefined' ? data['name'] : '') + '"></td><td><input id="loot' + i + '" type="text" value="' + (typeof data['loot'] != 'undefined' ? data['loot'] : '') + '"></td></tr>';
        });
        $('#memberList table tbody').html(tableContent);
    });
};

// Fill table with data
function populateTable(username) {

    username = typeof username !== 'undefined' ? username : '';

    // Empty content string 
    var tableContent = '';
    server = $('#serverlist option:selected').text();
    // jQuery AJAX call for JSON
    if (username != '') {
        url = '/session/usersessionlist';
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
            tableContent += '<td><a href="/party/' + this.sid + '">' + this.server + '</a></td>';
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

function update(event) {
    event.preventDefault();
    
    var dataToSend = {"data":[
        {"1": [{"name": $("#name1").val()}, {"loot": $("#loot1").val()}]},
        {"2": [{"name": $("#name2").val()}, {"loot": $("#loot2").val()}]},
        {"3": [{"name": $("#name3").val()}, {"loot": $("#loot3").val()}]},
        {"4": [{"name": $("#name4").val()}, {"loot": $("#loot4").val()}]},
        {"5": [{"name": $("#name5").val()}, {"loot": $("#loot5").val()}]},
        {"6": [{"name": $("#name6").val()}, {"loot": $("#loot6").val()}]},
        {"7": [{"name": $("#name7").val()}, {"loot": $("#loot7").val()}]},
        {"8": [{"name": $("#name8").val()}, {"loot": $("#loot8").val()}]}
    ]}
    
    console.log(dataToSend);
    id = window.location.href.split("/")[4];
    $.ajax({
      type: 'POST',
      data: dataToSend,
      url: '/party/update/' + id,
      dataType: 'JSON'
    }).done(function(response) {
        populateUserTable();
    });
  
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

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

function createSession(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#createSession input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        var sid = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        // If it is, compile all user info into one object
        var newSession = {
            'server': $('#createSession fieldset select#inputServerName option:selected').text(),
            'instance': $('#createSession fieldset select#inputInstanceName option:selected').text(),
            'sid':sid
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

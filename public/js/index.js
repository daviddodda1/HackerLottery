console.log(Cookies.get('token'));

$(document).ready(function () {
  //   console.log();
  if (Cookies.get('jwt_token')) {
    getLobbies();
  } else {
    window.location.href = '/login';
  }
});

const getLobbies = () => {
  $.ajax({
    url: `/api/lobby`,
    type: 'GET',
    success: function (data) {
      if (data.success) {
        console.log(data);
        $('#HouseEarnings').html(data.data.houseEarnings + ' Rs');
        //   console.log(Cookies.set('jwt_token', data.data.jwt));
        //   swal({
        //     title: 'Login Successful',
        //     text: 'Will redirect you to home page',
        //     icon: 'success',
        //   }).then((val) => {
        //     window.location.href = '/';
        //   });
        let htmlString = '';
        data.data.Lobby.forEach((lobby) => {
          htmlString += `<div class="lobby">
                          <div class="TempContainer">
                              <div class="lobbyData">
                                  <P>Name: <b>${lobby.name}</b></P>
                                  <P>UserNumber: <b>${lobby.userNumber}</b></P>
                                  <P>MaxNumber: <b>${lobby.maxNumber}</b></P>
                                  <P>Amount per user: <b>${
                                    lobby.amount
                                  }Rs</b></P>
                                  <P>Price pool: <b>${
                                    lobby.priceMoney
                                  }Rs</b></P>
                                  <p>Winner: <b>${lobby.winner}</b></p>
                              </div>
                              <div class="lobbyActions">
                                  
                                  ${
                                    lobby.userNumber < lobby.maxNumber
                                      ? `<button onclick="addUser('${lobby.id}')">Add User</button>`
                                      : ''
                                  }
                                  <button onclick="showUser('${
                                    lobby.id
                                  }')">View Users</button>
                                  ${
                                    lobby.userNumber == lobby.maxNumber &&
                                    lobby.winner == ''
                                      ? `<button onclick="drawWinner('${lobby.id}')">Draw Winner</button>`
                                      : ''
                                  }
                              </div>
                          </div>
                          <div class="UserNamesContainer displayNone" id="${
                            lobby.id
                          }">
                                <b>Users</b> <br/>
                              ${lobby.userList.join('<br>')} 
                              <br>
                              <br>
                              <button onclick="closeUser('${
                                lobby.id
                              }')">Close Users</button>
                          </div>
                      </div>`;
        });
        $('#LobbyContainer').html(htmlString);
      } else {
        swal({
          title: 'Login Error',
          text: data.message,
          icon: 'error',
        }).then((val) => {
          window.location.href = '/login';
        });
      }
    },
    error: function (err) {
      swal({
        title: 'Login Error',
        text: err.message,
        icon: 'error',
      });
    },
  });
  console.log('server request');
};

const addLobby = () => {
  const name = $('#lobbyName').val();
  const maxUsers = $('#maxUsers').val();
  const entryFee = $('#entryFee').val();

  if (name != '' && !isNaN(maxUsers) && !isNaN(entryFee)) {
    $.ajax({
      url: `/api/lobby`,
      type: 'POST',
      data: {
        name: name,
        maxUsers: maxUsers,
        entryFee: entryFee,
      },
      success: function (data) {
        if (data.success) {
          console.log(data);
          swal({
            title: 'Lobby created',
            text: 'Lobby has been created successfully',
            icon: 'success',
          }).then((val) => {
            location.reload();
          });
        } else {
          swal({
            title: 'Error Adding Lobby',
            text: data.message,
            icon: 'error',
          });
        }
      },
      error: function (err) {
        swal({
          title: 'Error Adding Lobby',
          text: err.message,
          icon: 'error',
        });
      },
    });
  } else {
    swal({
      title: 'Input Error',
      text:
        'There was an error with input. Lobby name must be Filled, Max num of users and cost per user must be a number',
      icon: 'error',
    });
  }
};

const addUser = (ID) => {
  swal({
    text: 'Adding user to Lobby, Please enter the name of the user',
    content: 'input',
    button: {
      text: 'Add User',
      closeModal: false,
    },
  }).then((name) => {
    if (name != '') {
      console.log(name, ID);
      $.ajax({
        url: `/api/lobby/user`,
        type: 'POST',
        data: {
          name: name,
          id: ID,
        },
        success: function (data) {
          if (data.success) {
            console.log(data);
            swal({
              title: 'User Added To lobby',
              text: 'User Has been added to the lobby',
              icon: 'success',
            }).then((val) => {
              location.reload();
            });
          } else {
            swal({
              title: 'Error Adding user to Lobby',
              text: data.message,
              icon: 'error',
            });
          }
        },
        error: function (err) {
          swal({
            title: 'Error Adding user to the Lobby',
            text: err.message,
            icon: 'error',
          });
        },
      });
    } else {
      swal({
        title: 'Input Error',
        text: 'There was an error with input. User name must be Filled',
        icon: 'error',
      });
    }
  });
  console.log(ID);
};

const showUser = (ID) => {
  $(`#${ID}`).removeClass('displayNone');
  console.log(ID);
};

const closeUser = (ID) => {
  $(`#${ID}`).addClass('displayNone');
  console.log(ID);
};

const drawWinner = (ID) => {
  $.ajax({
    url: `/api/lobby/drawWinner`,
    type: 'POST',
    data: {
      id: ID,
    },
    success: function (data) {
      if (data.success) {
        console.log(data);
        swal({
          title: `Winner is ${data.data.winner}!`,
          text: `The winner has been picked at random and has won ${data.data.pricePool}Rs`,
          icon: 'success',
        }).then((val) => {
          location.reload();
        });
      } else {
        swal({
          title: 'Error Adding user to Lobby',
          text: data.message,
          icon: 'error',
        });
      }
    },
    error: function (err) {
      swal({
        title: 'Error Adding user to the Lobby',
        text: err.message,
        icon: 'error',
      });
    },
  });
  console.log(ID);
};

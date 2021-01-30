$(document).ready(function () {});

const Login = () => {
  const userName = $('#name').val();
  const userPass = $('#pass').val();

  if (userName != '' && userPass != '') {
    $.ajax({
      url: `/api/login`,
      type: 'POST',
      data: {
        name: userName,
        password: userPass,
      },
      success: function (data) {
        console.log(data);
        console.log(Cookies.set('jwt_token', data.data.jwt));
        swal({
          title: 'Login Successful',
          text: 'Will redirect you to home page',
          icon: 'success',
        }).then((val) => {
          window.location.href = '/';
        });
      },
      error: function (err) {
        swal({
          title: 'Login Error',
          text: err.message,
          icon: 'error',
        });
      },
    });
  } else {
    swal({
      title: 'Empty Field detected',
      text: 'Please fill the form before submitting',
      icon: 'error',
    });
  }
};

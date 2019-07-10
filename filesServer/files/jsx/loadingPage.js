define(["jquery"],function ($) {
    let errBox;
    let methods={};
    methods.load=function (mode) {
        if (mode) {
            $('#loading_page').removeClass('hide').addClass('show');
        } else {
            $('#loading_page').removeClass('show').addClass('hide');
        }
    };
    methods.errBox=function (mess) {
         errBox = $('#alert_msgbox');
        let errBox_close_btn = $('#err_msg_close');
        let errBox_text = $('#err_msg_text');
        errBox_close_btn.click(function () {
            methods.errBoxRemove();
        });
        errBox.removeClass('hide').addClass('show');
        errBox_text.html(mess);
    };
    methods.errBoxRemove=function () {
      //  alert('close');
        errBox = $('#alert_msgbox');
        errBox.removeClass('show').addClass('hide');
    };

    return methods;

});
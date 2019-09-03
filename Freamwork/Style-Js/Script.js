$(document).ready(function() {
    Show_Data();
    $('.Sub_Btn').on('click',function() {
        document.getElementById("I_U_Form").reset();
        $("#Hidden_Field").val("Insert");
        $("#myModalLabel").text("فرم ثبت رویداد");
        $(".Sub_Btn_Form").text("ثبت");
        $(".Sub_Btn_Form").css("display","block");
        $(".Sub_Btn_Form2").css("display","none");

    });

    $('.Sub_Btn_Form').on('click', function () {
        if (confirm("آیا از ثبت این مورد اطمینان دارید؟")){
            $.ajax({
                type: 'post',
                url: 'Php/Processes.php',
                data: $('#I_U_Form').serialize(),
                success: function (Res) {
                    $("#Result_Tex").text(Res);
                    Animate_Box();
                    Show_Data();
                    document.getElementById("I_U_Form").reset();
                    $('#myModal').modal('hide');
                }
            });
            return false;
        }
    });

    $('.Sub_Btn_Form2').on('click', function () {
        $.ajax({
            type: 'post',
            url: 'Php/Processes.php',
            data: $('#I_U_Form').serialize(),
            success: function (Res) {
                $("#Result_Tex").text(Res);
                Animate_Box();
                Show_Data();
                document.getElementById("I_U_Form").reset();
                $('#myModal').modal('hide');
            }
        });
        return false;

    });
    $('.timeline').on('click', function () {
        alert("Ssss");
    });
/*------------------------------------ Function ----------------------------------*/
    function Show_Data()
    {
        $.ajax({
            type: 'post',
            url: 'Php/Processes.php',
            data: 'Show_Event_Data=2',
            success: function (ResEv) {
                $('#schedule').children().remove();
                eval(ResEv);
            }
        });
    }
    function Animate_Box()
    {
        $("#Result_Box").css("animation","Result_Box 3s forwards");
        setTimeout(function(){$("#Result_Box").css("animation","Result_Box 2s alternate");}, 6000);
    }
});

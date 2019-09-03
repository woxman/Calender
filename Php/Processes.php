<?php
require_once "Config.php";
$Con_DB=mysqli_connect($DB_Host,$DB_User,$DB_Pass,$DB_Name);
mysqli_set_charset($Con_DB,"utf8");

#------------------------------------------------------------------------------------------------

if (isset($_POST['Hidden_Field'])=="Insert"){
    //checked
    if ($_POST['Hidden_Field']=="Insert")
    {
        $res1=Insert_T($_POST['Title_Field'],$_POST['Day_Field'],$_POST['Time_Field1'],$_POST['Time_Field2'],$_POST['Color_Field'],$_POST['Note_Field']);
        echo $res1;
    }
}

if (isset($_POST['Get_Update'])){
    //checked
    $res2=Get_F($_POST['Get_Update']);
    echo $res2;
}

if (isset($_POST['Delete_Field'])){
    //checked
    $res3=Delete_T($_POST['Delete_Field']);
    echo $res3;
}

if (isset($_POST['Hidden_Field'])=="Update"){
    //checked
    if ($_POST['Hidden_Field']=="Update")
    {
        $res4=Update_T($_POST['Title_Field'],$_POST['Day_Field'],$_POST['Time_Field1'],$_POST['Time_Field2'],$_POST['Color_Field'],$_POST['Note_Field'],$_POST['Id_Field']);
        echo $res4;
    }
}
#------------------------------------------------------------------------------------------------

if (isset($_POST['Show_Event_Data']))
{
    Get_Darta();
    global $shanbe,$Yekshanbe,$Doshanbe,$Seshanbe,$Charshanbe,$Panjshanbe,$Jomee;
    global $Con_DB;
    $x="var sc = jQuery(\"#schedule\").timeSchedule({
    startTime: \"07:00\", // schedule start time(HH:ii)
    endTime: \"22:45\",   // schedule end time(HH:ii)
    widthTime:120 * 10,  // cell timestamp example 10 minutes
    timeLineY:70,       // height(px)
    verticalScrollbar:20,   // scrollbar (px)
    timeLineBorder:-50,   // border(top and bottom)
    bundleMoveWidth:6,  // width to move all schedules to the right of the clicked time line cell
    debug:\"#debug\",     // debug string output elements
    rows : {
        '0' : {
            title : 'شنبه',
            schedule:[
            "."
                $shanbe
            "."
            ]
        },
        '1' : {
            title : 'یکشنبه',
            schedule:[
            "."
                $Yekshanbe
            "."
            ]
        },
        '2' : {
            title : 'دوشنبه',
            schedule:[
            "."
                $Doshanbe
            "."
            ]
        },
        '3' : {
            title : 'سه شنبه',
            schedule:[
            "."
                $Seshanbe
            "."
            ]
        },
        '4' : {
            title : 'چهارشنبه',
            schedule:[
            "."
                $Charshanbe                
            "."
            ]
        },
        '5' : {
            title : 'پنجشنبه',
            schedule:[
            "."
                $Panjshanbe
            "."
            ]
        },
        '6' : {
            title : 'جمعه',
            schedule:[
            "."
                $Jomee
            "."
            ]
        },
    },
});
";
echo $x;
}

#---------------------------------Function-------------------------------------------------------
function Insert_T($Title, $Day, $F_Time, $S_Time, $Color, $Note)
{
    global $Con_DB;
    if ($Title != "" && $Day != "" && $F_Time != "" && $S_Time != "" && $Color != "" && $Note != "")
    {
        $InQuery= "INSERT INTO events(Title, Day, F_Time, S_Time, Color, Note) 
             VALUES('$Title', '$Day', '$F_Time','$S_Time','$Color','$Note')";
        $result = mysqli_query($Con_DB, $InQuery);
        if ($result)
        {
            return("رویداد با موفقیت ثبت شد.");
        }else{
            return("مشکلی پیش آمد!");
        }
    }else{
        return("لطفا تمامی فیلدها را وارد نمایید.");
    }
}

function Delete_T($DelId)
{
    global $Con_DB;
    $DelQuery= "DELETE FROM events WHERE id='$DelId'";
    $result = mysqli_query($Con_DB, $DelQuery);
    if ($result)
    {
        return("رویداد با موفقیت پاک شد.");
    }else{
        return("مشکلی پیش آمد!");
    }
}

function Update_T($Title, $Day, $F_Time, $S_Time, $Color, $Note, $id)
{
    global $Con_DB;
    $query1="UPDATE events SET Title='$Title' WHERE id='$id'";$result1 = mysqli_query($Con_DB, $query1);
    $query2="UPDATE events SET Day='$Day' WHERE id='$id'";$result2 = mysqli_query($Con_DB, $query2);
    $query3="UPDATE events SET F_Time='$F_Time' WHERE id='$id'";$result3 = mysqli_query($Con_DB, $query3);
    $query4="UPDATE events SET S_Time='$S_Time' WHERE id='$id'";$result4 = mysqli_query($Con_DB, $query4);
    $query5="UPDATE events SET Color='$Color' WHERE id='$id'";$result5 = mysqli_query($Con_DB, $query5);
    $query6="UPDATE events SET Note='$Note' WHERE id='$id'";$result6 = mysqli_query($Con_DB, $query6);

    if ($result1 && $result2 && $result3 && $result4 && $result5 && $result6)
    {
        return("رویداد با موفقیت آپدیت شد.");
    }else{
        return("مشکلی پیش آمد!");
    }
}

$shanbe="";
$Yekshanbe="";
$Doshanbe="";
$Seshanbe="";
$Charshanbe="";
$Panjshanbe="";
$Jomee="";

function Get_Darta()
{
    global $Con_DB;
    global $shanbe,$Yekshanbe,$Doshanbe,$Seshanbe,$Charshanbe,$Panjshanbe,$Jomee;
    $shquery="SELECT * FROM events WHERE Day='شنبه'";
    $shqueryr=mysqli_query($Con_DB,$shquery);
    while ($row=mysqli_fetch_array($shqueryr))
    {
        $shanbe.="{\n";
        $shanbe.="start:'".$row['F_Time']."',\n";
        $shanbe.="end:'".$row['S_Time']."',\n";
        $shanbe.="color:'".$row['Color']."',\n";
        $shanbe.="id:'".$row['id']."',\n";
        $shanbe.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $shanbe.="data:{}\n";
        $shanbe.="},\n";
    }

    $Yequery="SELECT * FROM events WHERE Day='یکشنبه'";
    $Yequeryr=mysqli_query($Con_DB,$Yequery);
    while ($row=mysqli_fetch_array($Yequeryr))
    {
        $Yekshanbe.="{\n";
        $Yekshanbe.="start:'".$row['F_Time']."',\n";
        $Yekshanbe.="end:'".$row['S_Time']."',\n";
        $Yekshanbe.="color:'".$row['Color']."',\n";
        $Yekshanbe.="id:'".$row['id']."',\n";
        $Yekshanbe.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $Yekshanbe.="data:{}\n";
        $Yekshanbe.="},\n";
    }

    $DOquery="SELECT * FROM events WHERE Day='دوشنبه'";
    $DOqueryr=mysqli_query($Con_DB,$DOquery);
    while ($row=mysqli_fetch_array($DOqueryr))
    {
        $Doshanbe.="{\n";
        $Doshanbe.="start:'".$row['F_Time']."',\n";
        $Doshanbe.="end:'".$row['S_Time']."',\n";
        $Doshanbe.="color:'".$row['Color']."',\n";
        $Doshanbe.="id:'".$row['id']."',\n";
        $Doshanbe.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $Doshanbe.="data:{}\n";
        $Doshanbe.="},\n";
    }

    $Sequery="SELECT * FROM events WHERE Day='سه شنبه'";
    $Sequeryr=mysqli_query($Con_DB,$Sequery);
    while ($row=mysqli_fetch_array($Sequeryr))
    {
        $Seshanbe.="{\n";
        $Seshanbe.="start:'".$row['F_Time']."',\n";
        $Seshanbe.="end:'".$row['S_Time']."',\n";
        $Seshanbe.="color:'".$row['Color']."',\n";
        $Seshanbe.="id:'".$row['id']."',\n";
        $Seshanbe.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $Seshanbe.="data:{}\n";
        $Seshanbe.="},\n";
    }

    $Charquery="SELECT * FROM events WHERE Day='چهارشنبه'";
    $Charqueryr=mysqli_query($Con_DB,$Charquery);
    while ($row=mysqli_fetch_array($Charqueryr))
    {
        $Charshanbe.="{\n";
        $Charshanbe.="start:'".$row['F_Time']."',\n";
        $Charshanbe.="end:'".$row['S_Time']."',\n";
        $Charshanbe.="color:'".$row['Color']."',\n";
        $Charshanbe.="id:'".$row['id']."',\n";
        $Charshanbe.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $Charshanbe.="data:{}\n";
        $Charshanbe.="},\n";
    }

    $Panjquery="SELECT * FROM events WHERE Day='پنجشنبه'";
    $Panjqueryr=mysqli_query($Con_DB,$Panjquery);
    while ($row=mysqli_fetch_array($Panjqueryr))
    {
        $Panjshanbe.="{\n";
        $Panjshanbe.="start:'".$row['F_Time']."',\n";
        $Panjshanbe.="end:'".$row['S_Time']."',\n";
        $Panjshanbe.="color:'".$row['Color']."',\n";
        $Panjshanbe.="id:'".$row['id']."',\n";
        $Panjshanbe.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $Panjshanbe.="data:{}\n";
        $Panjshanbe.="},\n";
    }

    $Jomquery="SELECT * FROM events WHERE Day='جمعه'";
    $Jomqueryr=mysqli_query($Con_DB,$Jomquery);
    while ($row=mysqli_fetch_array($Jomqueryr))
    {
        $Jomee.="{\n";
        $Jomee.="start:'".$row['F_Time']."',\n";
        $Jomee.="end:'".$row['S_Time']."',\n";
        $Jomee.="color:'".$row['Color']."',\n";
        $Jomee.="id:'".$row['id']."',\n";
        $Jomee.="text:'".$row['Note']."(".$row['Title'].")',\n";
        $Jomee.="data:{}\n";
        $Jomee.="},\n";
    }
}

function Get_F($id)
{
    global $Con_DB;
    $GetDquery="SELECT * FROM events WHERE id='$id'";
    $GetDqueryr=mysqli_query($Con_DB,$GetDquery);
    while ($row=mysqli_fetch_array($GetDqueryr))
    {
        $Title=$row['Title'];
        $Day=$row['Day'];
        $Time1=$row['F_Time'];
        $Time2=$row['S_Time'];
        $Color=$row['Color'];
        $Note=$row['Note'];
    }
    $resdom="document.getElementById(\"Title\").value = \"$Title\";document.getElementById(\"Day\").value = \"$Day\";document.getElementById(\"Time1\").value = \"$Time1\";
    document.getElementById(\"Time2\").value = \"$Time2\";document.getElementById(\"Color\").value = \"$Color\";document.getElementById(\"Note\").value = \"$Note\";document.getElementById(\"Id\").value = \"$id\";";
    return($resdom);
}
#---------------------------------Function-------------------------------------------------------

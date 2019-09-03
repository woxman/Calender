function Del(x){
    if (confirm("آیا از پاک کردن این رویداد اطمینان دارید؟"))
    {
        $.ajax({
            type: 'post',
            url: 'Php/Processes.php',
            data: 'Delete_Field='+x,
            success: function (DelEv) {
                $("#Result_Tex").text(DelEv);
                $("#Result_Box").css("animation","Result_Box 3s forwards");
                setTimeout(function(){$("#Result_Box").css("animation","Result_Box 2s alternate");}, 6000);
                setTimeout(function(){location.reload();}, 1500);
            }
        });
    }
}
function T_Toltip(x){
    var text=x.childNodes[1].innerHTML;
    var ptext=x.childNodes[1];
    ptext.setAttribute('title', text);
    
    new $.Zebra_Tooltips($('.text'),{
        max_width:  800
    });

}

function Up(x) {
    $.ajax({
        type: 'post',
        url: 'Php/Processes.php',
        data: 'Get_Update='+x,
        success: function (UpEv) {
            eval(UpEv);
        }
    });
}
(function($) {
    $.fn.timeSchedule = function(options){
        var defaults = {
            rows : {},
            startTime: "07:00",
            endTime: "20:30",
            widthTimeX:25,		// 1cell辺りの幅(px)
            widthTime:600,		// 区切り時間(秒)
            timeLineY:50,		// timeline height(px)
            timeLineBorder:1,	// timeline height border
            timeBorder:1,		// border width
            timeLinePaddingTop:0,
            timeLinePaddingBottom:0,
            headTimeBorder:1,	// time border width
            dataWidth:160,		// data width
            verticalScrollbar:0,	// vertical scrollbar width
            bundleMoveWidth:1,  // width to move all schedules to the right of the clicked time cell
            // event
            init_data: null,
            change: null,
            click: null,
            append: null,
            time_click: null,
            debug:""			// debug selecter
        };
        this.calcStringTime = function(string) {
            var slice = string.split(':');
            var h = Number(slice[0]) * 60 * 60;
            var i = Number(slice[1]) * 60;
            var min = h + i;
            return min;
        };
        this.formatTime = function(min) {
            var h = "" + (min/36000|0) + (min/3600%10|0);
            var i = "" + (min%3600/600|0) + (min%3600/60%10|0);
            var string = h + ":" + i;
            return string;
        };

        var setting = $.extend(defaults,options);
        this.setting = setting;
        var scheduleData = new Array();
        var timelineData = new Array();
        var $element = $(this);
        var element = (this);
        var tableStartTime = element.calcStringTime(setting.startTime);
        var tableEndTime = element.calcStringTime(setting.endTime);
        var currentNode = null;
        tableStartTime -= (tableStartTime % setting.widthTime);
        tableEndTime -= (tableEndTime % setting.widthTime);

        this.getScheduleData = function(){
            return scheduleData;
        }
        this.getTimelineData = function(){
            return timelineData;
        }
        // 現在のタイムライン番号を取得
        this.getTimeLineNumber = function(top){
            var num = 0;
            var n = 0;
            var tn = Math.ceil(top / (setting.timeLineY + setting.timeLinePaddingTop + setting.timeLinePaddingBottom));
            for(var i in setting.rows){
                var r = setting.rows[i];
                var tr = 0;
                if(typeof r["schedule"] == Object){
                    tr = r["schedule"].length;
                }
                if(currentNode && currentNode["timeline"]){
                    tr ++;
                }
                n += Math.max(tr,1);
                if(n >= tn){
                    break;
                }
                num ++;
            }
            return num;
        }

        // 背景データ追加
        this.addScheduleBgData = function(data){
            var st = Math.ceil((data["start"] - tableStartTime) / setting.widthTime);
            var et = Math.floor((data["end"] - tableStartTime) / setting.widthTime);
            var $bar = jQuery('<div class="sc_bgBar"><span class="text"></span></div>');
            var stext = element.formatTime(data["start"]);
            var etext = element.formatTime(data["end"]);
            var snum = element.getScheduleCount(data["timeline"]);
            $bar.css({
                left : (st * setting.widthTimeX),
                top : 0,
                width : ((et - st) * setting.widthTimeX),
                height : $element.find('.sc_main .timeline').eq(data["timeline"]).height()
            });
            if(data["text"]){
                $bar.find(".text").text(data["text"]);
                $bar.find(".text").text(data["color"]);
                $bar.find(".text").text(data["id"]);
            }
            if(data["class"]){
                $bar.addClass(data["class"]);
            }
            //$element.find('.sc_main').append($bar);
            $element.find('.sc_main .timeline').eq(data["timeline"]).append($bar);
        };

            // スケジュール追加
        this.addScheduleData = function(data){
            var st = Math.ceil((data["start"] - tableStartTime) / setting.widthTime);
            var et = Math.floor((data["end"] - tableStartTime) / setting.widthTime);
            var $bar = jQuery("<div class='sc_Bar' onmouseout=\"T_Toltip(this);\"><span class='head'><span class='time'></span></span><span class='text' id='text'></span><i class='fas fa-trash-alt Delete' id='"+data['id']+"' onclick=\"Del(this.id)\" style='font-size:24px;float: left'></i><i class='fas fa-edit Edit' id='"+data['id']+"' onclick=\"Up(this.id)\" data-toggle='modal' data-target='#myModal' style='font-size:24px;float: right'></i></div>");
            var stext = element.formatTime(data["start"]);
            var etext = element.formatTime(data["end"]);
            var snum = element.getScheduleCount(data["timeline"]);
            //************************************
            var color=data["color"];
            var id=data["id"];
            //************************************
            $bar.css({
                left : (st * setting.widthTimeX),
                top : ((snum * setting.timeLineY) + setting.timeLinePaddingTop),
                width : ((et - st) * setting.widthTimeX),
                height : (setting.timeLineY),
                backgroundColor :(color)
            });
            $bar.find(".time").text(stext+"-"+etext);
            if(data["text"]){
                $bar.find(".text").text(data["text"]);

            }
            if(data["class"]){
                $bar.addClass(data["class"]);
            }
            //$element.find('.sc_main').append($bar);
            $element.find('.sc_main .timeline').eq(data["timeline"]).append($bar);
            // データの追加
            scheduleData.push(data);
            // key
            var key = scheduleData.length - 1;
            $bar.data("sc_key",key);
            /**************Update****************/
            $('.Edit').on('click', function () {
                $("#Hidden_Field").val("Update");
                $("#myModalLabel").text("فرم آپدیت رویداد");
                $(".Sub_Btn_Form2").text("آپدیت");
                $(".Sub_Btn_Form").css("display","none");
                $(".Sub_Btn_Form2").css("display","block");
            });
            /**************Update****************/
            /*$('.Delete').on('click', function () {
                var id = $(this).attr("id");
                alert(id);
            });*/

            var $node = $element.find(".sc_Bar");
            // move node.
       
            $node.resizable({
                handles:'e',
                grid: [ setting.widthTimeX, setting.timeLineY ],
                minWidth:setting.widthTimeX,
                start: function(event, ui){
                    var node = jQuery(this);
                    node.data("resizeCheck",true);
                },
                // 要素の移動が終った後の処理
                stop: function(event, ui){
                    var node = jQuery(this);
                    var sc_key = node.data("sc_key");
                    var x = node.position().left;
                    var w = node.width();
                    var start = tableStartTime + (Math.floor(x / setting.widthTimeX) * setting.widthTime);
                    var end = tableStartTime + (Math.floor((x + w) / setting.widthTimeX) * setting.widthTime);
                    var timelineNum = scheduleData[sc_key]["timeline"];

                    scheduleData[sc_key]["start"] = start;
                    scheduleData[sc_key]["end"] = end;

                    // 高さ調整
                    element.resetBarPosition(timelineNum);
                    // テキスト変更
                    element.rewriteBarText(node,scheduleData[sc_key]);

                    node.data("resizeCheck",false);
                    // コールバックがセットされていたら呼出
                    if(setting.change){
                        setting.change(node, scheduleData[sc_key]);
                    }
                }
            });
            return key;
        };
        // スケジュール数の取得
        this.getScheduleCount = function(n){
            var num = 0;
            for(var i in scheduleData){
                if(scheduleData[i]["timeline"] == n){
                    num ++;
                }
            }
            return num;
        };
        // add
        this.addRow = function(timeline,row){
            var title = row["title"];
            var id = $element.find('.sc_main .timeline').length;

            var html;

            html = '';
            html += '<div class="timeline"><span>'+title+'</span></div>';
            var $data = jQuery(html);
            // event call
            if(setting.init_data){
                setting.init_data($data,row);
            }
            $element.find('.sc_data_scroll').append($data);

            html = '';
            html += '<div class="timeline"></div>';
            var $timeline = jQuery(html);
            for(var t=tableStartTime;t<tableEndTime;t+=setting.widthTime){
                var $tl = jQuery('<div class="tl"></div>');
                $tl.width(setting.widthTimeX - setting.timeBorder);

                $tl.data("time",element.formatTime(t));
                $tl.data("timeline",timeline);
                $timeline.append($tl);
            }
            // クリックイベント

            $element.find('.sc_main').append($timeline);

            timelineData[timeline] = row;

            if(row["class"] && (row["class"] != "")){
                $element.find('.sc_data .timeline').eq(id).addClass(row["class"]);
                $element.find('.sc_main .timeline').eq(id).addClass(row["class"]);
            }
            // スケジュールタイムライン
            if(row["schedule"]){
                for(var i in row["schedule"]){
                    var bdata = row["schedule"][i];
                    var s = element.calcStringTime(bdata["start"]);
                    var e = element.calcStringTime(bdata["end"]);

                    var data = {};
                    data["timeline"] = id;
                    data["start"] = s;
                    data["end"] = e;
                    if(bdata["text"]){
                        data["text"] = bdata["text"];
                    }
                    data["data"] = {};
                    if(bdata["data"]){
                        data["data"] = bdata["data"];
                        data["color"] = bdata["color"];
                        data["id"] = bdata["id"];
                    }
                    element.addScheduleData(data);
                }
            }
            // 高さの調整
            element.resetBarPosition(id);
            $element.find('.sc_main .timeline').eq(id).droppable({
                accept: ".sc_Bar",
                drop: function(ev, ui) {
                    var node = ui.draggable;
                    var sc_key = node.data("sc_key");
                    var nowTimelineNum = scheduleData[sc_key]["timeline"];
                    var timelineNum = $element.find('.sc_main .timeline').index(this);
                    // タイムラインの変更
                    scheduleData[sc_key]["timeline"] = timelineNum;
                    node.appendTo(this);
                    // 高さ調整
                    element.resetBarPosition(nowTimelineNum);
                    element.resetBarPosition(timelineNum);
                }
            });
            // コールバックがセットされていたら呼出
            if(setting.append){
                $element.find('.sc_main .timeline').eq(id).find(".sc_Bar").each(function(){
                    var node = jQuery(this);
                    var sc_key = node.data("sc_key");
                    setting.append(node, scheduleData[sc_key]);
                });
            }
        };
        this.getScheduleData = function(){
            var data = new Array();

            for(var i in timelineData){
                if(typeof timelineData[i] == "undefined") continue;
                var timeline = jQuery.extend(true, {}, timelineData[i]);
                timeline.schedule = new Array();
                data.push(timeline);
            }

            for(var i in scheduleData){
                if(typeof scheduleData[i] == "undefined") continue;
                var schedule = jQuery.extend(true, {}, scheduleData[i]);
                schedule.start = this.formatTime(schedule.start);
                schedule.end = this.formatTime(schedule.end);
                var timelineIndex = schedule.timeline;
                delete schedule.timeline;
                data[timelineIndex].schedule.push(schedule);
            }

            return data;
        };
        // テキストの変更

        this.resetBarPosition = function(n){
            // 要素の並び替え
            var $bar_list = $element.find('.sc_main .timeline').eq(n).find(".sc_Bar");
            var codes = [];
            for(var i=0;i<$bar_list.length;i++){
                codes[i] = {code:i,x:jQuery($bar_list[i]).position().left};
            };
            // ソート
            codes.sort(function(a,b){
                if(a["x"] < b["x"]){
                    return -1;
                }else if(a["x"] > b["x"]){
                    return 1;
                }
                return 0;
            });
            var check = [];
            var h = 0;
            var $e1,$e2;
            var c1,c2;
            var s1,e1,s2,e2;
            for(var i=0;i<codes.length;i++){
                c1 = codes[i]["code"];
                $e1 = jQuery($bar_list[c1]);
                for(h=0;h<check.length;h++){
                    var next = false;
                    L: for(var j=0;j<check[h].length;j++){
                        c2 = check[h][j];
                        $e2 = jQuery($bar_list[c2]);

                        s1 = $e1.position().left;
                        e1 = $e1.position().left + $e1.width();
                        s2 = $e2.position().left;
                        e2 = $e2.position().left + $e2.width();
                        if(s1 < e2 && e1 > s2){
                            next = true;
                            continue L;
                        }
                    }
                    if(!next){
                        break;
                    }
                }
                if(!check[h]){
                    check[h] = [];
                }
                $e1.css({top:((h * setting.timeLineY) + setting.timeLinePaddingTop)});
                check[h][check[h].length] = c1;
            }
            // 高さの調整
            this.resizeRow(n,check.length);
        };
        this.resizeRow = function(n,height){
            //var h = Math.max(element.getScheduleCount(n),1);
            var h = Math.max(height,1);
            $element.find('.sc_data .timeline').eq(n).height((h * setting.timeLineY) - setting.timeLineBorder + setting.timeLinePaddingTop + setting.timeLinePaddingBottom);
            $element.find('.sc_main .timeline').eq(n).height((h * setting.timeLineY) - setting.timeLineBorder + setting.timeLinePaddingTop + setting.timeLinePaddingBottom);

            $element.find('.sc_main .timeline').eq(n).find(".sc_bgBar").each(function(){
                jQuery(this).height(jQuery(this).closest(".timeline").height());
            });

            $element.find(".sc_data").height($element.find(".sc_main_box").height());
        }
        // resizeWindow
        this.resizeWindow = function(){
            var sc_width = $element.width();
            var sc_main_width = sc_width - setting.dataWidth - (setting.verticalScrollbar);
            var cell_num = Math.floor((tableEndTime - tableStartTime) / setting.widthTime);
            $element.find(".sc_header_cell").width(setting.dataWidth);
            $element.find(".sc_data,.sc_data_scroll").width(setting.dataWidth);
            $element.find(".sc_header").width(sc_main_width);
            $element.find(".sc_main_box").width(sc_main_width);
            $element.find(".sc_header_scroll").width(setting.widthTimeX*cell_num);
            $element.find(".sc_main_scroll").width(setting.widthTimeX*cell_num);

        };
        // move all cells of the right of the specified time line cell
        this.moveSchedules = function(timeline, baseTimeLineCell, moveWidth){
            var $bar_list = $element.find('.sc_main .timeline').eq(timeline).find(".sc_Bar");
            for(var i=0;i<$bar_list.length;i++){
                var $bar = jQuery($bar_list[i]);
                if(baseTimeLineCell.position().left <= $bar.position().left) {
                    $bar.css({left : Math.max(0, Math.min($bar.position().left + setting.widthTimeX * moveWidth, Math.floor((tableEndTime - tableStartTime) / setting.widthTime) * setting.widthTimeX - $bar.width()))});

                    var sc_key = $bar.data("sc_key");
                    var start = tableStartTime + (Math.floor($bar.position().left / setting.widthTimeX) * setting.widthTime);
                    var end = start + ((scheduleData[sc_key]["end"] - scheduleData[sc_key]["start"]));
                    scheduleData[sc_key]["start"] = start;
                    scheduleData[sc_key]["end"] = end;
                    element.rewriteBarText($bar,scheduleData[sc_key]);

                    // if setting
                    if(setting.change) {
                        setting.change($bar, scheduleData[sc_key]);
                    }
                }
            }
            element.resetBarPosition(timeline);
        };
        // init
        this.init = function(){
            var html = '';
            html += '<div class="sc_menu">'+"\n";
            html += '<div class="sc_header_cell"><span>&nbsp;</span></div>'+"\n";
            html += '<div class="sc_header">'+"\n";
            html += '<div class="sc_header_scroll">'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '<br class="clear" />'+"\n";
            html += '</div>'+"\n";
            html += '<div class="sc_wrapper">'+"\n";
            html += '<div class="sc_data">'+"\n";
            html += '<div class="sc_data_scroll">'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '<div class="sc_main_box">'+"\n";
            html += '<div class="sc_main_scroll">'+"\n";
            html += '<div class="sc_main">'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '</div>'+"\n";
            html += '<br class="clear" />'+"\n";
            html += '</div>'+"\n";

            $element.append(html);

            $element.find(".sc_main_box").scroll(function(){
                $element.find(".sc_data_scroll").css("top", $(this).scrollTop() * -1);
                $element.find(".sc_header_scroll").css("left", $(this).scrollLeft() * -1);

            });
            // add time cell
            var cell_num = Math.floor((tableEndTime - tableStartTime) / setting.widthTime);
            var before_time = -1;
            for(var t=tableStartTime;t<tableEndTime;t+=setting.widthTime){

                if(
                    (before_time < 0) ||
                        (Math.floor(before_time / 3600) != Math.floor(t / 3600))){
                    var html = '';
                    html += '<div class="sc_time">'+element.formatTime(t)+'</div>';
                    var $time = jQuery(html);
                    var cell_num = Math.floor(Number(Math.min((Math.ceil((t + setting.widthTime) / 3600) * 3600),tableEndTime) - t) / setting.widthTime);
                    $time.width((cell_num * setting.widthTimeX) - setting.headTimeBorder);
                    $element.find(".sc_header_scroll").append($time);

                    before_time = t;
                }
            }

            jQuery(window).resize(function(){
                element.resizeWindow();
            }).trigger("resize");

            // addrow
            for(var i in setting.rows){
                this.addRow(i,setting.rows[i]);
            }
        };
        // 初期化
        this.init();

        this.debug = function(){
            var html = '';
            for(var i in scheduleData){
                html += '<div>';

                html += i+" : ";
                var d = scheduleData[i];
                for(var n in d){
                    var dd = d[n];
                    html += n+" "+dd;
                }

                html += '</div>';
            }
            jQuery(setting.debug).html(html);
        };
        if(setting.debug && setting.debug != ""){
            setInterval(function(){
                element.debug();
            },10);
        }

        return( this );
    };
})(jQuery);

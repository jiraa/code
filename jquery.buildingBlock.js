(function($) {

    $.fn.buildingBlock = function(options) {

        var settings = $.extend({
            'type': 0,
            'margins': 3,
            'wrapH': 0,
            'minWidth': 283,
            'maxWidth': 1000
        }, options);

        return this.each(function(index, cont) {
            var imgList = $(cont).find('.photo-item img');
            var imgs = [];
            if (imgList.length == 0) return;
            $.each(imgList, function(index, item) {
                imgs[index] = {};
                imgs[index].src = $(item).attr('src');
                imgs[index].width = Math.round($(item).attr('width'));
                imgs[index].height = Math.round($(item).attr('height'));
                imgs[index].showId = $(item).attr('data-id');
            });
            $(cont).find('.photo-item').remove();
            createPhotoList(cont, imgs, settings);
        });

        function createCell(column, settings) {
            var columnCont = "";
            $.each(column, function(index, img) {
                columnCont += createPhoto(img);
            });
            return "<div class=\"cell\" style=\"height: " + settings.wrapH + "px; margin-right:" + settings.margins + "px;\">" + columnCont + "</div>";
        }

        function createPhotoList(cont, imgs, settings) {
            var column;
            var imgItem = imgs.shift();
            var tmpH, tmpW;
            var imgH, imgW;
            var tmpHT, tmpWT;
            var imgHT, imgWT;
            do {
                //图片高大于容器高
                if (imgItem.height >= settings.wrapH || imgs.length == 0) {
                    column = [];
                    tmpH = settings.wrapH;
                    tmpW = imgItem.width * (tmpH / imgItem.height);
                    // 缩放后图片宽小于最小宽
                    if (tmpW < settings.minWidth) {
                        imgW = settings.minWidth;
                        imgH = tmpH * (settings.minWidth / tmpW);
                    } else {
                        imgW = tmpW;
                        imgH = tmpH;
                    }
                    imgItem.height = imgH;
                    imgItem.width = imgW;
                    imgItem.boxH = imgH;
                    imgItem.boxW = imgW;
                    //缩放后图片宽大于最大宽，限定容器宽，切割
                    if (imgW > 1000) {
                        imgItem.boxW = 1000;
                    }

                    column.push(imgItem);
                    $(cont).append(createCell(column, settings));
                } else {
                    // 第二张图片
                    column = [];
                    var imgItemTwo = imgs.shift();
                    //两张图比例一致
                    if (imgItem.width / imgItem.height == imgItemTwo.width / imgItemTwo.height) {
                        tmpH = settings.wrapH / 2;
                        tmpW = imgItem.width * (tmpH / imgItem.height);
                        tmpHT = settings.wrapH / 2;
                        tmpWT = imgItemTwo.width * (tmpHT / imgItemTwo.height);
                        imgH = tmpH;
                        imgW = tmpW;
                        imgHT = tmpHT;
                        imgWT = tmpWT;
                        //宽比高大于等于1
                        if (imgItem.width / imgItem.height >= 1) {
                            imgItem.boxH = imgH;
                            imgItem.boxW = imgH;
                            imgItemTwo.boxH = imgH;
                            imgItemTwo.boxW = imgH;
                        } else {
                            imgItem.boxH = imgH;
                            imgItem.boxW = imgW;
                            imgItemTwo.boxH = imgH;
                            imgItemTwo.boxW = imgW;
                        }
                        imgItem.height = imgH;
                        imgItem.width = imgW;
                        imgItemTwo.height = imgHT;
                        imgItemTwo.width = imgWT;
                    } else {
                        tmpHT = settings.wrapH / (imgItem.height + imgItemTwo.height) * imgItemTwo.height;
                        tmpH = settings.wrapH - tmpHT;
                        tmpW = imgItem.width * (tmpH / imgItem.height);
                        tmpWT = imgItemTwo.width * (tmpHT / imgItemTwo.height);

                        if (tmpW > tmpWT) {
                            imgWT = tmpW;
                            imgHT = tmpHT *(imgWT / tmpWT);
                            imgW = tmpW;
                            imgH = tmpH;
                            imgItem.boxW = tmpW;
                            imgItemTwo.boxW = tmpW;
                        } else {
                            imgW = tmpWT;
                            imgH = tmpH *(imgW / tmpW);
                            imgWT = tmpWT;
                            imgHT = tmpHT;
                            imgItem.boxW = tmpWT;
                            imgItemTwo.boxW = tmpWT;
                        }
                        imgItem.boxH = tmpH;
                        imgItemTwo.boxH = tmpHT;
                        imgItem.height = imgH;
                        imgItem.width = imgW;
                        imgItemTwo.height = imgHT;
                        imgItemTwo.width = imgWT;
                    }
                    imgItem.maginB = settings.margins;
                    imgItemTwo.maginB = 0;
                    //图片宽小于minWidth 
                    if (imgItem.width <= settings.minWidth) {
                        imgItem.height = imgItem.height * (settings.minWidth / imgItem.width);
                        imgItem.width = settings.minWidth ;
                        imgItem.boxW = settings.minWidth ;
                        imgItemTwo.boxW = settings.minWidth ;
                        imgItem.src += '_w283';
                    }
                    if (imgItemTwo.width <= settings.minWidth ) {
                        imgItemTwo.height = imgItemTwo.height * (settings.minWidth  / imgItemTwo.width);
                        imgItemTwo.width = settings.minWidth ;
                        imgItem.boxW = settings.minWidth ;
                        imgItemTwo.boxW = settings.minWidth ;
                        imgItemTwo.src += '_w283';
                    }
                    column.push(imgItem, imgItemTwo);
                    $(cont).append(createCell(column, settings));

                }
            } while (imgItem = imgs.shift());
        }

        function createPhoto(img) {
            var photo;
            photo = "<div class= 'photo-item' style='margin-bottom:" + img.maginB + "px; '>";
            photo += "<div class='pic' style=' width:" + img.boxW + "px; height:" + img.boxH + "px; '>";
            photo += "<img src = '" + img.src + "'" + "style='height:" + img.height + "px;" + " width:" + img.width + "px;'data-id='" + img.showId + "' />";
            photo += "</div>";
            photo += "</div>";
            return photo;
        }

    }

})(jQuery);
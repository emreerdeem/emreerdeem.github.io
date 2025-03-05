var iscountyselected = false;
var previouscountyselected = "blank";
var start = true;
var past = null;
var content_dir = "details";

$(function () {
    var r = Raphael('map'),
        attributes = {
            fill: '#666',
            stroke: '#fff',
            'stroke-width': 0.5,
            'stroke-linejoin': 'round',
        },
        arr = [];

    for (var county in paths) {
        var obj = r.path(paths[county].path);
        obj.attr(attributes);
        arr[obj.id] = county;

        if (arr[obj.id] !== 'blank') {
            obj.data('selected', 'notSelected');

            obj.node.id = arr[obj.id]; // Ensure obj.id is set correctly.

            obj.attr(attributes).attr({ title: paths[arr[obj.id]].name });

            obj.hover(function () {
                var countyId = arr[this.id];
                $('#coatOfArms').addClass(countyId + 'large sprite-largecrests');
                $('#countyInfo').text(paths[countyId].name);
                $('#searchResults').stop(true, true);
            }, function () {
                $('#coatOfArms').removeClass();
                if (paths[arr[this.id]].value == 'notSelected') {
                    $('.' + paths[arr[this.id]].name)
                        .slideUp('slow', function () {
                            $(this).remove();
                        });
                }
            });

            obj.click(function () {
                var countyId = arr[this.id];
                if (paths[countyId].value == 'notSelected') {
                    this.animate({ fill: '#000' }, 200);
                    if (previouscountyselected !== "blank") {
                        paths[previouscountyselected].value = "notSelected";
                    }
                    paths[countyId].value = "isSelected";
                    previouscountyselected = paths[countyId].name;

                    $('<div/>', {
                        title: countyId,
                        'class': countyId + 'small sprite-smallcrests'
                    }).appendTo('#selectedCounties').qtip(countyCrest);

                    $("#countymenu").val(paths[countyId].county);

                    if (!start && past != this) {
                        past.animate({ fill: '#666' }, 200);
                    }
                    past = this;
                    start = false;
                } else if (paths[countyId].value == 'isSelected') {
                    this.animate({ fill: '#15d4f5' }, 200);
                    paths[countyId].value = "notSelected";
                    $("." + previouscountyselected + 'small').remove();
                }
            });

            var countyCrest = {
                content: {
                    attr: 'title'
                },
                position: {
                    target: 'mouse'
                },
                style: {
                    classes: 'ui-tooltip-tipsy ui-tooltip-shadow',
                    tip: true
                }
            };

            function hoverin(e) {
                if (paths[arr[this.id]].value == 'notSelected') {
                    this.animate({ fill: '#15d4f5' }, 50);
                }
            }

            function hoverout(e) {
                if (paths[arr[this.id]].value == 'notSelected') {
                    this.animate({ fill: '#666' }, 300);
                }
            }

            obj.mouseout(hoverout);
            obj.mouseover(hoverin);
        }
    }

    // Yolu Çizme
    function drawRoute(cityIds) {
        var pathData = "";

        for (var i = 0; i < cityIds.length - 1; i++) {
            var from = $("#" + cityIds[i])[0].getBoundingClientRect(); // Şehirlerin başlangıç noktaları
            var to = $("#" + cityIds[i + 1])[0].getBoundingClientRect(); // Şehirlerin bitiş noktaları

            if (i === 0) {
                pathData += "M" + (from.left + from.width / 2) + "," + (from.top + from.height / 2); // Başlangıç noktası
            }

            // Bağlantı noktaları
            pathData += " L" + (to.left + to.width / 2) + "," + (to.top + to.height / 2);
        }

        // Yolu tamamla (Z komutu ekleyin)
        pathData += " Z";

        // SVG içinde rota çizme
        var svg = $("#map svg")[0];
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "#000");
        path.setAttribute("stroke-width", 2);
        path.setAttribute("fill", "none");
        svg.appendChild(path);
    }

    $('#countyInfo').hide();
    $('#spinner').hide();
});

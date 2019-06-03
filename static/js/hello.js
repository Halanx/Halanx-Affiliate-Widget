(function () {

    // Localize jQuery variable
    let jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.4.0') {
        let script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "https://code.jquery.com/jquery-3.4.1.min.js");

        // if (script_tag.readyState && script.readyState) {
        //     script_tag.onreadystatechange = function () { // For old versions of IE
        //         script.onreadystatechange = function () { // For old versions of IE
        //             if (this.readyState === 'complete' || this.readyState === 'loaded') {
        //                 scriptLoadHandler();
        //             }
        //         };
        //     };
        // } 
        // else { // Other browsers
        script_tag.onload = scriptLoadHandler;
        // }

        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main1();
    }

    function main1() {

        let widget_url = "http://localhost:3000/";
        fetch(widget_url, {
            headers: {
                'Content-Type': 'text/html'
            }
        }).then(res => {
            res.text().then(function (d) {
                document.getElementById('widget-container').innerHTML = d;
            })
        })

        // $('#widget-container').html(data);

        let script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src",
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDUNbtArqyJdXw5ewEZIgo493_Lue49HUs&libraries&libraries=places");
        script.onload = main;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
    }

    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function ($) {
            console.log('ready');
            let headings1 = [
                'Zero Brokerage',
                '24x7 Support',
                'Furnished Spaces',
                'Essential Amenities',
                'Get Neighborhood News',
                'Get Cashback'
            ];

            let LAT,LNG,AA,AT;

            let backgrounds1 = [
                'http://localhost:3000/img/icon.png',
                'http://localhost:3000/img/icon.png',
                'http://localhost:3000/img/icon.png',
                'http://localhost:3000/img/icon.png',
                'http://localhost:3000/img/icon.png',
                'http://localhost:3000/img/icon.png'
            ]

            let heading1 = $('.pla .card p');
            let ss1 = $('.pla .card img');

            var count = 0;
            setInterval(function () {
                console.log(count);
                if (count == backgrounds1.length - 1) {
                    count = 0;
                } else {
                    count++;
                }
                heading1.animate({
                    'opacity': 0
                }, 200, function () {
                    heading1.html(headings1[count]).animate({
                        'opacity': 1
                    }, 200);
                });
                ss1.fadeOut(200, function () {
                    ss1.attr('src', backgrounds1[count]);
                    ss1.fadeIn(200);
                });
            }, 3500);

            google.maps.event.addDomListener(window, 'load', initialize);

            $(document).on("keydown", "form", function (event) {
                return event.key !== "Enter";
            });

            $('#b1').click(initialize);

            function initialize() {
                let input = document.getElementById('select_location');
                var autocomplete = new google.maps.places.Autocomplete(input);
                google.maps.event.addListener(autocomplete, 'place_changed', () => {
                    var place = autocomplete.getPlace();
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();
                    var at = AT || 'flat,shared,private';
                    var aa = AA || 'girls,boys,family';

                    LAT = lat;
                    LNG = lng;
                    console.log(lat, lng);
                    // window.location.href = `/?lat=${lat}&lng=${lng}`;
                    $.get(`http://localhost:3000/api?lat=${lat}&lng=${lng}&accomodation_type=${at}&accomodation_allowed=${aa}`, (data) => {
                        console.log(data);
                        data = data.results;
                        $('.boxes').html(' ');
                        $('.pla').fadeOut();
                        data.forEach(d => {
                            var html = `
                                <style>#use{display:none!important;} .filter-button {display:block!important;}</style>
                                <div class="row" ng-repeat="row in houseRows">
                                    <a href="https://halanx.com/house/${d.id}" target="_blank" style="color: inherit; text-decoration: none" class="box" ng-repeat="h in row">
                                        <div class="upper2">
                                            <div class="upper" style="background-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(34,34,34,1) 100%),url(${d.cover_pic_url }); position:relative; background-size: cover; background-repeat: no-repeat; background-position: center center;">
                                                <div style="position: absolute; bottom: 4px; right: 4px; left: 4px; margin:0; color: white; font-weight: bold; display:flex; justify-content:space-between;">
                                                    <span><i class="fa fa-inr"></i>${d.rent_from}/month</span>
                                                    <span>${d.accomodation_allowed_str}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="lower2">
                                            <div class="box-row">
                                                <button class="btn-theme btn-small" onclick="window.open('https://halanx.com/house/${d.id}/book-house')">Book Now</button>
                                                <button class="btn-theme spl btn-small" onclick="window.open('https://halanx.com/house/${d.id}/schedule-visit')">Plan Visit</button>
                                            </div>
                                        </div>
                                        <!-- <button class="btn-theme btn-circle btn-small" style="position:absolute; right:4px; top:4px; color: #fff;"> <i class="fa fa-info"></i> </button> -->
                                    </a>
                                </div>
                                `;
                            $('.boxes').append(html);
                        });
                    });
                });
            }

            $('.filter-button').click(() => {
                $('.filter-page').fadeIn(300);
                $('#halanx_main').css('overflow-y', 'hidden');
            });

            $('.apply').click(() => {
                $('#halanx_main').css('overflow-y', 'scroll');
                $('.filter-page').fadeOut(300);
                var lat = LAT;
                var lng = LNG;
                var at = $("input[name='at']:checked").val() || 'flat,shared,private';
                var aa = $("input[name='aa']:checked").val() || 'girls,boys,family';

                AT = at;
                AA = aa;

                console.log(lat, lng, 2);
                $.get(`http://localhost:3000/api?lat=${lat}&lng=${lng}&accomodation_type=${at}&accomodation_allowed=${aa}`, (data) => {
                    console.log(data);
                    data = data.results;
                    $('.boxes').html(' ');
                    $('.pla').fadeOut();
                    data.forEach(d => {
                        var html = `
                                <style>#use{display:none!important;} .filter-button {display:block!important;}</style>
                                <div class="row" ng-repeat="row in houseRows">
                                    <a target="_blank" href="https://halanx.com/house/${d.id}" style="color: inherit; text-decoration: none" class="box" ng-repeat="h in row">
                                        <div class="upper2">
                                            <div class="upper" style="background-image: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(34,34,34,1) 100%),url(${d.cover_pic_url }); position:relative; background-size: cover; background-repeat: no-repeat; background-position: center center;">
                                                <div style="position: absolute; bottom: 4px; right: 4px; left: 4px; margin:0; color: white; font-weight: bold; display:flex; justify-content:space-between;">
                                                    <span><i class="fa fa-inr"></i>${d.rent_from}/month</span>
                                                    <span>${d.accomodation_allowed_str}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="lower2">
                                            <div class="box-row">
                                                <button class="btn-theme btn-small" onclick="window.open('https://halanx.com/house/${d.id}/book-house')">Book Now</button>
                                                <button class="btn-theme spl btn-small" onclick="window.open('https://halanx.com/house/${d.id}/schedule-visit')">Plan Visit</button>
                                            </div>
                                        </div>
                                        <!-- <button class="btn-theme btn-circle btn-small" style="position:absolute; right:4px; top:4px; color: #fff;"> <i class="fa fa-info"></i> </button> -->
                                    </a>
                                </div>
                                `;
                        $('.boxes').append(html);
                    });
                });
            });
        });
    }

})();
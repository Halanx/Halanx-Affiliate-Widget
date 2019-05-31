(function () {

    // Localize jQuery variable
    let jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.4.0') {
        let script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src",
            "https://code.jquery.com/jquery-3.4.1.min.js");

        let script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src",
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDUNbtArqyJdXw5ewEZIgo493_Lue49HUs&libraries&libraries=places");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else { // Other browsers
            script_tag.onload = scriptLoadHandler;
        }

        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script);
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
        main();
    }

    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function ($) {
            /******* Load CSS *******/
            // let css_link = $("<link>", {
            //     rel: "stylesheet",
            //     type: "text/css",
            //     href: "http://localhost:3000/css/style.css"
            // });
            // css_link.appendTo('head');

            console.log('ready');

            /******* Load HTML *******/
            let widget_url = "http://localhost:3000/";
            $.get(widget_url, function (data) {
                // console.log(data);
                $('#widget-container').html(data);
            });

            $(document).ready(function ($) {
                console.log($('.pla').children()[0]);
                var count = 0;
                // setInterval(() => {
                //     $($('.pla').children()).each(function (i, v) {
                //         // v.fadeOut(600);
                //         console.log(v)
                //     });
                //     console.log(count);
                //     // $('.pla').children()[count].fadeIn(500);
                //     count++;
                //     if(count==3) count=0;
                // }, 3000)

                google.maps.event.addDomListener(window, 'load', initialize);

                $(document).on("keydown", "form", function (event) {
                    return event.key !== "Enter";
                });
            });

            function initialize() {
                let input = document.getElementById('select_location');
                var autocomplete = new google.maps.places.Autocomplete(input);
                google.maps.event.addListener(autocomplete, 'place_changed', () => {
                    var place = autocomplete.getPlace();
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();
                    console.log(lat, lng);
                    // window.location.href = `/?lat=${lat}&lng=${lng}`;
                    $.get(`http://localhost:3000/api?lat=${lat}&lng=${lng}`, (data) => {
                        console.log(data);
                        data = data.results;
                        $('.pla').fadeOut();
                        data.forEach(d => {
                            var html = `
            <div class="row" ng-repeat="row in houseRows">
                <div style="color: inherit; text-decoration: none" class="box" ng-repeat="h in row">
                    <div class="upper2">
                        <div class="upper" style="background-image: url(${d.cover_pic_url }); background: linear-gradient(to down, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 1%, rgba(34,34,34,1) 100%); position:relative; background-size: cover; background-repeat: no-repeat; background-position: center center;">
                            <div style="position: absolute; bottom: 4px; left: 4px; margin:0; color: white; font-weight: bold;">
                                <span><i class="fa fa-inr"></i>${d.rent_from}/month</span>
                                <span>${d.accomodation_allowed_str}</span>
                            </div>
                        </div>
                    </div>
                    <div class="lower2">
                        <div class="box-row">
                            <button class="btn-theme btn-small">Book Now</button>
                            <button class="btn-theme spl btn-small">Plan Visit</button>
                        </div>
                    </div>
                    <!-- <button class="btn-theme btn-circle btn-small" style="position:absolute; right:4px; top:4px; color: #fff;"> <i class="fa fa-info"></i> </button> -->
                </div>
            </div>
                        `;
                            $('.boxes').append(html);
                        });
                    });
                });
            }
        });
    }

})();
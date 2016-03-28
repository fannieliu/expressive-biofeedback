$(".mode-button").click(function() {
    $(".mode-button").not(this).removeClass("mode-button-active");
    $(this).toggleClass("mode-button-active");

    var buttonid = $(this).attr("id");
    if (buttonid == "record-button") {
        $('#record-menu').css("display", "inline-block");
        $('#replay-menu').css("display", "none");
    } else {
        $('#replay-menu').css("display", "inline-block");
        $('#record-menu').css("display", "none");
    }
});

$(".viz-menu-item").click(function() {
    $(".viz-menu-item").not(this).removeClass("viz-menu-active");
    $(this).toggleClass("viz-menu-active");
    var buttonid = $(this).attr("id");
    if (buttonid == "viz-menu-lines") {
        $("#graph-container").css("display", "inline-block");
        $("#emoji-container").css("display", "none");
        $("#swirl-container").css("display", "none");
        $("#colors-container").css("display", "none");
    } else if (buttonid == "viz-menu-emoji") {
        $("#graph-container").css("display", "none");
        $("#emoji-container").css("display", "inline-block");
        $("#swirl-container").css("display", "none");
        $("#colors-container").css("display", "none");
    } else if (buttonid == "viz-menu-swirl") {
        $("#graph-container").css("display", "none");
        $("#emoji-container").css("display", "none");
        $("#swirl-container").css("display", "inline-block");
        $("#colors-container").css("display", "none");
    } else if (buttonid == "viz-menu-colors") {
        $("#graph-container").css("display", "none");
        $("#emoji-container").css("display", "none");
        $("#swirl-container").css("display", "none");
        $("#colors-container").css("display", "inline-block");
    }
});

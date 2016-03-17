// interactions with the graph

$(".graphdiv ul li:not(.active)")
  // change any non-active opacity to 0.7
  .css({ opacity: 0.4 })
  // now bind to anon non-active items
  .hover(function() {
      $(this).animate({ opacity: 1 });
    }, function() {
      $(this).animate({ opacity: 0.4 });
  });

$("li").hover(function() {
    $(this).toggleClass("active");
    // remove the lines for everything that is not active
    var i = $(this).attr('id');
    removeAllButOneLine(i);
  }, function() {
    // add back all the lines!
    addAllLines();
  });
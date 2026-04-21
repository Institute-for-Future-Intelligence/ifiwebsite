(function($){

    $(document).ready(function(){
        browserDetection();
        initSideNav();
        initEmptyParaFix();
        initStickyTopNav();
        initMobileNav();
        initStickySideNav();
        initBtns();
        initSocialToggle();
        initSideBarHelper();
        initExpertFiltering();
        initResourcesSearch();
        initBlogSecondaryFilters();
        initDownloadDetail();
        initHomepage();
        initSearchBar();
        initSliders();
        initSearchResults();
        initSelectBoxes();
        initCareersifiPage();

        $('.share-text').click(function(evt){
            var $wrap = $(this).next('.share-wrap');
            if (!$wrap.is(':visible')){
                $(this).hide();
                $wrap.show();
                evt.preventDefault();
            }
        });
        
        $('a').filter(function() {
           return this.hostname && this.hostname !== location.hostname;
        }).addClass("external");

    });

    /* On Window Load */
    $(window).on('load', function(){
        initSideBarHelper();
    });

    /* On Window Resize */
    $(window).resize(function(){
        initSocialToggle();
        initStickyTopNav();
        initSideBarHelper();
    });


    function fireEvent(element,event){
        if (document.createEventObject){
            // dispatch for IE
            var evt = document.createEventObject();
            return element.fireEvent('on'+event,evt)
        }
        else{
            // dispatch for firefox + others
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    }
    function initSelectBoxes(){
        var refreshIntervalId = setInterval(function() {
          if(jQuery('select.goog-te-combo').length==1) {
            [].slice.call( document.querySelectorAll( 'select.goog-te-combo' ) ).forEach( function(el) {    
                new SelectFx(el, {
                  onChange: function(val) {
                     var jObj = $('select.goog-te-combo');
                     var db = jObj.get(0);
                     jObj.val(val);
                     fireEvent(db, 'change');
                  }
                });
            });
            var val = $('#google_translator_element select').val();
            $('div.goog-te-combo').find('.cs-placeholder').trigger('click').end().find('[data-value="'+val+'"]').trigger('click');
            clearInterval(refreshIntervalId);
            refreshIntervalId = false;
          }
        }, 1000);
    }

//


//



    function initStickySideNav(){
        if($('.region-sidebar-first .sticky-sidenav').length > 0){
            var $subHeader 	= $('header#navbar').height() + $('.page-header-wrap').height() - 100,
                $footer			= $('.footer'),
                $links = $('.sticky-sidenav .content li a'),
                $footerHeight 	= $('footer').height();

                // Update here for ticket #21902
                $subHeader = $('.sticky-sidenav').offset().top - 100;
            //$windowWidth = $(window).width();
            //if($windowWidth < 767){
                $('.region-sidebar-first .sticky-sidenav').affix({
                    offset: {
                        top:$subHeader,
                        bottom: function(){ return $('footer').outerHeight() }
                    }
                });
            //}
            $links.click(function(event){

                var offsetTop, $target, newHash;
                if(location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    newHash = this.hash;
                    $target = $(newHash);
                    if ($target.length == 0){
                        $target = $('[name=' + newHash.slice(1) +']');
                    }
                    if ($target.length > 0) {
                        offsetTop = $target.offset().top - 200;
                        $('html,body').animate({ scrollTop: offsetTop }, 1000, function(){
                            if(history.pushState) {
                                history.pushState(null, null, newHash);
                            } else {
                                location.hash = newHash;
                            }
                        });
                        return false;   // note - this fixes the chrome bug
                    }
                    event.preventDefault();
                }
            });
            // apply scrollspy
            $('.sticky-sidenav .content > ul').addClass('nav');
            var bodyOffset = 250;
            //console.log('bodyOffset',bodyOffset);
            $spy = $('body').scrollspy({ target: '.sticky-sidenav .content', offset: bodyOffset });
            $spy.on('activate', function (evt) { /* console.log('activate this one ',evt); */ });
            
        }
    }

    function initMobileNav(){


        $('header#navbar .navbar-toggle').click(function(){
            var $this = $(this);
            if($this.hasClass('active')){
                $this.removeClass('active');
            }else{
                $this.addClass('active');
            }
        });

        //Mobile
        function toggleExpand(evt){
            console.log('expand or collapse this item', $(this),$(this).next('ul.dropdown-menu'));
            var $list = $(this).next('ul.dropdown-menu');
            if ($list.hasClass('open')){
                $list.removeClass('open').hide();
                $(this).find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }else {
                $list.addClass('open').show();
                $(this).find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
            }
            evt.preventDefault();
        }
        $('#block-menu-block-2 .nav > li > a').after($('<a class="toggle-icon" href="#"><i class="fa fa-chevron-down"></i></a>').click(toggleExpand));

    }

    function initStickyTopNav(){
        var phoneMaxWidth = 766,
            cbContainer = $('#wrapper'),
            cbNavBar = $('#navbar');
        if (!cbNavBar.hasClass('stickyoff')) {
            var cbNavOffset = 1 + $('.region-navigation').height(),
                cbNavHeight = $('#navbar').height(),
                cbLoggedIn = 0;
            if ($('#wpadminbar').length > 0) {
                cbLoggedIn = 32;
            }
            function drawBar(){
                //console.log('drawbar');
                if ($(window).width() >= phoneMaxWidth && $(window).scrollTop() > cbNavOffset) {
                    cbNavBar.addClass('navbar-fixed-top');
                    $('.cb-stuck').css('margin-top', cbLoggedIn);
                    cbContainer.css('margin-top', cbNavHeight);
                    $('body').addClass('overlay-fixed-topnav');
                } else {
                    cbNavBar.css('margin-top', 0).removeClass('navbar-fixed-top');
                    cbContainer.css('margin-top', 0);
                    $('body').removeClass('overlay-fixed-topnav');
                }
            }
            if (!cbNavBar.hasClass('sticky-initialized')){
                cbNavBar.addClass('sticky-initialized');
                $(window).scroll(drawBar);
            }
            drawBar();
        }
    }

    function initEmptyParaFix() {
        $caption    = $('.caption'),
        $prePara    = $caption.prev('p'),
        $postPara   = $caption.next('p');

        if($prePara.val() == ''){
            $prePara.remove();
        }
        if($postPara.val() == ''){
            $postPara.remove();
        }
        $caption.unwrap();

    }

    function initSearchBar(){
        $('#search-block-form input.apachesolr-autocomplete')
            .attr('placeholder', 'Search')
            .bind('blur', function(){ $(this).removeClass("focus"); $(this).parents('form').first().removeClass('focus'); })
            .bind('focus', function(){ $(this).addClass("focus"); $(this).parents('form').first().addClass("focus"); });
    }

    function initSliders(){
        $('.flexslider').each(function(){
            var $captions = $(this).find('.flex-caption');
                slidetot = $captions.length,
                curslide = 0;
                $captions.each(function(){
                    curslide++;
                    $(this).prepend('<span class="slide-count">' + curslide + "/" + slidetot + "</span>");
                });
        });
    }

    function initSearchResults(){
        if ($('body.page-search-site').length>0){
            var $header = $('.page-header'),
                $crumb = $('.breadcrumb'),
                $input = $('#main-content-area .apachesolr-autocomplete');
            if ($input.length == 1){
                if ($input.val() != ''){
                    $header.text('Site Search for ' + $input.val());
                } else {
                    $header.text('Site Search');
                }
            }
            if ($crumb.length == 1){
                $crumb.html('<i class="fa fa-arrow-left"></i> Search');
            }
        }
    }

    function browserDetection(){
        var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
        var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
        var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
        var is_safari = navigator.userAgent.indexOf("Safari") > -1;
        var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
        if ((is_chrome)&&(is_safari)) {is_safari=false;}
        if ((is_chrome)&&(is_opera)) {is_chrome=false;}
        if (is_safari){ $('body').addClass('is-safari'); }
        if(is_chrome){  $('body').addClass('is-chrome'); }
    }

    function initSideNav(){

        $('.region-sidebar-first .secondary-nav .nav > li.active-trail > a:first-child').click(function(event) {
            event.preventDefault();
        });


        /* Responsive Sub Nav */
        var $responsiveSubNav = $('.region-sidebar-first .responsive-secondary-nav .nav > li.active-trail > a:first-child');

        $responsiveSubNav.append(' <i class="fa fa-chevron-down fa-1x"></i>');

        $responsiveSubNav.click(function(event) {
            $this = $(this);
            if($this.parent().hasClass('show-drop')){
                $this.parent().removeClass('show-drop');
                $this.find('i').removeClass('fa-chevron-up');
                $this.find('i').addClass('fa-chevron-down');
                $this.next('.dropdown-menu').hide();
            }else{
                $this.parent().addClass('show-drop');
                $this.find('i').removeClass('fa-chevron-down');
                $this.find('i').addClass('fa-chevron-up');
                $this.next('.dropdown-menu').show();
                //$this.next('.dropdown-menu').addClass('collapsing');
            }
            event.preventDefault();
        });

    }

    function initBtns(){
        $('.btn-large').append('<i class="fa fa-arrow-right"></i>');
    }

    function initSocialToggle(){

        $windowWidth = $(window).width();
        if($windowWidth < 767){
            //alert();
            //$('.social-links ');

        }
    }
    function initSideBarHelper(){
        var windowWidth = $(window).width(),
            $tweetBlock = $('body.page-newsroom-landing .ifi-tweets-block');
        if($tweetBlock.length > 0){
            if (windowWidth < 992){
                // 1 column
                if (!$tweetBlock.parent('.region').hasClass('region-sidebar-second') && $('.region.region-sidebar-second').length == 1){
                    //Don't re-move
                    if ( $('aside.col-sm-3 #block-menu-block-6').length == 1 ) {
                        $('section.col-sm-6').detach().insertBefore('aside.col-sm-3:first');
                        $('div#block-menu-block-6').detach().insertBefore('section.col-sm-6');
                        $('div#block-block-19').detach().insertBefore($tweetBlock);
                        $('div#block-block-20').detach().insertBefore($tweetBlock);
                        //$('div.share-tools').css('display','none');
                    }
                    //Move section.col-sm-6 before aside.col-sm-3
                    //Move div#block-menu-block-6 before section.col-sm-6
                //console.log('move twitter block for 1 col - goes into sidebar second', $tweetBlock);
                // since we cannot move the twitter block we move everything else
                //jQuery('.featured-content-block').insertAfter('.secondary-nav')
                //$tweetBlock.appendTo($('.region.region-sidebar-second'));
                //$('.region-sidebar-second').append($tweetBlock);
                    //if($('body').hasClass('page-newsroom-landing')){
                    //    $('.newsletter-block').append($tweetBlock);
                    //}
                }
            } else {
                // 2 column
                if (!$tweetBlock.parent('.region').hasClass('region-sidebar-second') && $('.region.region-sidebar-first').length == 1){
                    if ( $('aside.col-sm-3 #block-menu-block-6').length == 0 ) {
                        //$('div.share-tools').css('display', 'auto');
                        $('div#block-menu-block-6').detach().prependTo('aside.col-sm-3:first');
                        $('section.col-sm-6').detach().insertAfter('aside.col-sm-3:first');
                    }

                    //$tweetBlock.appendTo($('.region.region-sidebar-first'));
                }
            }
        }
    }

    function initCareersifiPage() {
      $('.page-node-8 #main-content-area').find('section.col-sm-6').removeClass('col-sm-6').addClass('col-sm-9');
    }

    $('.remove-href').removeAttr('href');

    function initExpertFiltering() {
        if ( $('#expert_filter').length > 0 ) {
            var allExperts = $('.vocabulary-types-of-people > .content > .node-people.node-teaser').clone(true,true);
            if ($.fn.selectpicker){
                $('#expert_filter').selectpicker({
                    style: 'btn-lg',
                    dropupAuto: false
                });
            }
            $('#expert_filter').change(function() {
                var $this = $(this);
                var tid = $this.find('option:selected').val();
                console.log(allExperts);
                $('.vocabulary-types-of-people > .content').empty();
                if ( tid == 0 ) {
                    allExperts.appendTo('.vocabulary-types-of-people > .content');
                } else {
                    // Filter
                    var filterClass = 'term-' + tid;
                    allExperts.each( function() {
                        var $expert = $(this);
                        if ( $expert.hasClass(filterClass) ) {
                            $expert.appendTo('.vocabulary-types-of-people > .content');
                        }
                    });
                }
            });
        }
    }

    function initResourcesSearch(){
        var $form = $('#views-exposed-form-resources-landing-page-1');
        if ( $form.length > 0 ) {
            // disable all the form tooltips as they're not very useful
            $('.views-exposed-form [data-toggle=tooltip]').tooltip('destroy');
            // set placeholder on text field
            $('#edit-combine').attr('placeholder', $('label[for=edit-combine]').text().trim());
            if ($.fn.selectpicker){
                $('#edit-tid option[value=All]').text('Body of Work');
                $('#edit-tid').selectpicker({ style: 'btn-lg' });
            }
            // now tweak the panel and 'extra' filters
            var $link = $('#edit-secondary-wrapper fieldset .panel-heading a'),
            //$linkTarget = $( $link.attr('href') );
            $linkTarget = $link.parent('.panel-heading').next();
            //$link.parent('.panel-heading').insertAfter($linkTarget);
            var closedText = 'Show more filters',
                /*closedText = $link.text(),*/
                openText = 'Hide filters';
            var drawButtonText = function(){
                if ($link.hasClass('opened')){
                    $link.removeClass('opened').text(closedText);
                } else {
                    $link.addClass('opened').text(openText);
                }
            }
            if (!$linkTarget.hasClass('in')){
                $link.addClass('opened');
            }
            drawButtonText();
            $link.click(function(evt){
                drawButtonText();
            });
            var $selectedFilters = $('#edit-secondary .bef-checkboxes input:checked');
                // add filter labels and a clear button
                if ($selectedFilters.length > 0){
                    $('#views-record-count-text').after('<div id="filter-labels"></div>');
                    var $labels = $('#filter-labels');
                    $selectedFilters.each(function(){
                        var txt = $(this).next('label').text(),
                            val = $(this).val(),
                            target = '#'+$(this).attr('id'),
                            $lab = $('<span class="label label-warning">'+txt+' <i class="fa fa-close"></i></span>');
                            $labels.append($lab);
                            $lab.click(function(evt){
                                $(target).attr('checked',false);
                                $(this).remove();
                                $form.submit();
                                evt.preventDefault();
                            });
                    });
                    var $clearAllLink = $('<a href="#" class="btn btn-link">Clear All</a>').click(function(evt){
                        // remove all the labels, uncheck all boxes and submit the form
                        $selectedFilters.attr('checked',false);
                        $labels.find('.label').remove();
                        $(this).remove();
                        $form.submit();
                        evt.preventDefault();
                    });
                    $labels.append($clearAllLink);
                }
        }
    }
    
    function initBlogSecondaryFilters(){
        var $form = $('#views-exposed-form-blog-page');
        if ( $form.length > 0 ) {
            // disable all the form tooltips as they're not very useful
            $('.views-exposed-form [data-toggle=tooltip]').tooltip('destroy');
            // set placeholder on text field
            //$('#edit-combine').attr('placeholder', $('label[for=edit-combine]').text().trim());
            /*if ($.fn.selectpicker){
                $('#edit-tid option[value=All]').text('Body of Work');
                $('#edit-tid').selectpicker({ style: 'btn-lg' });
            }*/
            $('#edit-secondary > .panel-heading').insertAfter('#edit-secondary > .panel-collapse');
            // now tweak the panel and 'extra' filters
            var $link = $('#edit-secondary-wrapper fieldset .panel-heading a'),
            //$linkTarget = $( $link.attr('href') );
            $linkTarget = $link.parent('.panel-heading').next();
            //$link.parent('.panel-heading').insertAfter($linkTarget);
            var closedText = 'More filters',
                /*closedText = $link.text(),*/
                openText = 'Hide filters';
            var drawButtonText = function(){
                if ($link.hasClass('opened')){
                    $link.removeClass('opened').text(closedText);
                } else {
                    $link.addClass('opened').text(openText);
                }
            }
            if (!$linkTarget.hasClass('in')){
                $link.addClass('opened');
            }
            drawButtonText();
            $link.click(function(evt){
                drawButtonText();
            });
        }
    }

    function initDownloadDetail(){
        if ($('body').hasClass('node-type-resources')){
            var $node = $('.node-type-resources .node');
            if ($node.hasClass('resource-media-type-download') || $node.hasClass('resource-media-type-website') || $node.hasClass('resource-media-type-pdf')){
                var $bodyField = $('.field-name-body .field-items > .field-item');
                $bodyField.children().each(function(index, el){
                    // skip any empty items
                    if ($(el).text() != ''){
                        if (!$(el).hasClass('media')){
                            $bodyField.addClass('no-lead-image');
                        }
                        return false; // exit after the first non-empty element
                    }
                });
            }
        }
    }

    function initHomepage(){
        if ($('body').hasClass('front')){
            $('h1.page-header').html('<span>How does</span><span>learning</span><span>transform</span><span>lives?</span>');
        }
    }

})(jQuery);


(function($){
    $.fn.focusTextToEnd = function(){
        this.focus();
        var $thisVal = this.val();
        this.val('').val($thisVal);
        return this;
    }
}(jQuery));
// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


// To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.my_custom_behavior = {
  attach: function(context, settings) {
    //#131295851: Articles (basic): hiding border decoration when header image has a caption
    if ($('.node-type-news').length > 0) {
      var $imgcaption, $imgwidth;
      if (!$('.image-caption').length > 0) {
        $('.main-news-content').removeClass('ifi-image-caption');
      }
      $imgcaption = $('.media-element-container .field-name-field-caption');
      $imgwidth = $imgcaption.siblings('img').width();
      $imgcaption.width($imgwidth);
    }
    // Donate button click event – go directly to Paypal
    /*if ($('.donate-btn-block').length > 0) {
      $('.donate-btn-link').click(function(event) {
        event.stopPropagation();
        event.preventDefault();
        $('.donate-btn-block input[type="submit"]').trigger('click');
      });
    }*/
    /*if ($('.node-type-blog .field-name-field-blog-author').length > 0) {
      $('.node-type-blog .field-name-field-blog-author .field-item:first-child').prepend('<span>By </span>');
      $('.node-type-blog .field-name-field-blog-author .field-item:not(first-child)').prepend('<span style="margin-left:-4px;">&nbsp;and&nbsp;</span>');
    }*/
    if ($('.node-type-blog .field-name-field-blog-author-staff').length > 0) {
      $('.node-type-blog .field-name-field-blog-author-staff .field-item:first-child').prepend('<span class="aux">By&nbsp;</span>');
      $('.node-type-blog .field-name-field-blog-author-staff .field-item:not(:first-child):not(:last-child)').append('<span class="aux">,</span>');
      if ($('.node-type-blog .field-name-field-blog-author-override').length > 0) {
        $('.node-type-blog .field-name-field-blog-author-override .field-item:first-child').prepend('<span class="aux">and&nbsp;</span>');
        if ($('.node-type-blog .field-name-field-blog-author-staff .field-item').length > 1) {
          $('.node-type-blog .field-name-field-blog-author-staff .field-item:first-child').append('<span class="aux">,</span>');
        }
        if ($('.node-type-blog .field-name-field-blog-author-staff .field-item').length >= 2) {
          $('.node-type-blog .field-name-field-blog-author-staff .field-item:last-child').append('<span class="aux">,</span>');
        }
      }
      else {
        if ($('.node-type-blog .field-name-field-blog-author-staff .field-item').length > 2) {
          $('.node-type-blog .field-name-field-blog-author-staff .field-item:first-child').append('<span class="aux">,</span>');
        }
        if ($('.node-type-blog .field-name-field-blog-author-staff .field-item').length >= 2) {
          $('.node-type-blog .field-name-field-blog-author-staff .field-item:last-child').prepend('<span class="aux">and&nbsp;</span>');
        }
      }
    }
    else {
      if ($('.node-type-blog .field-name-field-blog-author-override').length > 0) {
        $('.node-type-blog .field-name-field-blog-author-override .field-item:first-child').prepend('<span class="aux">By&nbsp;</span>');
      }
    }
    if (($('.view-blog.view-display-id-page > .view-content').length > 0) && ($('.view-blog.view-display-id-page > .view-content.dn').length == 0)) {
      $('.view-blog.view-display-id-page > .view-content').addClass("dn");
      $('.view-blog.view-display-id-page > .view-content .views-row').each(function() {
        if($(this).find('.views-field-field-blog-author-staff .ifi-exp-staff').length > 0) {
          $(this).find('.views-field-field-blog-author-staff .ifi-exp-staff:first-child').prepend('<span class="aux">By&nbsp;</span>');
          $(this).find('.views-field-field-blog-author-staff .ifi-exp-staff:not(:first-child):not(:last-child)').append('<span class="aux">,</span>');
          if($(this).find('.views-field-field-blog-author-override .override-exp').length > 0) {
            $(this).find('.views-field-field-blog-author-override').addClass('override-subsidiary').prepend('<span class="aux">and&nbsp;</span>');
            if($(this).find('.views-field-field-blog-author-staff .ifi-exp-staff').length > 1) {
              $(this).find('.views-field-field-blog-author-staff .ifi-exp-staff:first-child').append('<span class="aux">,</span>');
            }
            if($(this).find('.views-field-field-blog-author-staff .ifi-exp-staff').length >= 2) {
              $(this).find('.views-field-field-blog-author-staff .ifi-exp-staff:last-child').append('<span class="aux">,</span>');
            }
          }
          else {
            if($(this).find('.views-field-field-blog-author-staff .ifi-exp-staff').length > 2) {
              $(this).find('.views-field-field-blog-author-staff .ifi-exp-staff:first-child').append('<span class="aux">,</span>');
            }
            if($(this).find('.views-field-field-blog-author-staff .ifi-exp-staff').length >= 2) {
              $(this).find('.views-field-field-blog-author-staff .ifi-exp-staff:last-child').prepend('<span class="aux">and&nbsp;</span>');
            }
          }
        }
        else {
          if($(this).find('.views-field-field-blog-author-override .override-exp').length > 0) {
            $(this).find('.views-field-field-blog-author-override').addClass('override-main').prepend('<span class="aux">By&nbsp;</span>');
          }
        }
      });
    }
    if (($('.view-blog .view-display-id-block_1').length > 0) && ($('.view-blog .view-display-id-block_1.dn').length == 0)) {
      $('.view-blog .view-display-id-block_1').addClass("dn");
      if($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span').length > 0) {
        $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span:first-child').prepend('<span class="aux">By&nbsp;</span>');
        $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span:not(:first-child):not(:last-child)').append('<span class="aux">,</span>');
        if ($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-override span').length > 0) {
          $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-override').addClass('override-subsidiary');
          $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-override.override-subsidiary span').prepend('<span class="aux">and&nbsp;</span>');
          if($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span').length > 1) {
            $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span:first-child').append('<span class="aux">,</span>');
          }
          if($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span').length >= 2) {
            $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span:last-child').append('<span class="aux">,</span>');
          }
        }
        else {
          if($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span').length > 2) {
            $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span:first-child').append('<span class="aux">,</span>');
          }
          if($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span').length >= 2) {
            $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-staff .field-content > span:last-child').prepend('<span class="aux">and&nbsp;</span>');
          }
        }
      }
      else {
        if ($('.view-blog .view-display-id-block_1 .views-field-field-blog-author-override').length > 0) {
          $('.view-blog .view-display-id-block_1 .views-field-field-blog-author-override span').prepend('<span class="aux">By&nbsp;</span>');
        }
      }
    }
    if ($('.node-type-blog .field-name-field-comment-your-name').length > 0) {
      $(".field-name-field-comment-your-name input").attr("placeholder", "Your Name*");
    }
    if ($('.node-type-blog .field-name-field-comment-your-email').length > 0) {
      $(".field-name-field-comment-your-email input").attr("placeholder", "Your E-mail* (Your e-mail will not be displayed)");
    }
    if ($('.node-type-blog .field-name-comment-body').length > 0) {
      $(".field-name-comment-body textarea").attr("placeholder", "Your Reply");
    }
    // Comment reply page
    if ($('.page-comment-reply .field-name-field-blog-author-override').length > 0) {
      $('.page-comment-reply .field-name-field-blog-author-override .field-item').prepend('<span>By </span>');
    }
    if ($('.page-comment-reply .field-name-field-blog-author').length > 0) {
      $('.page-comment-reply .field-name-field-blog-author .field-item').prepend('<span>By </span>');
    }
    if ($('.page-comment-reply .field-name-field-blog-author-staff').length > 0) {
      $('.page-comment-reply .field-name-field-blog-author-staff .field-item').prepend('<span>By </span>');
    }
    if ($('.page-comment-reply .field-name-field-comment-your-name').length > 0) {
      $(".field-name-field-comment-your-name input").attr("placeholder", "Your Name*");
    }
    if ($('.page-comment-reply .field-name-field-comment-your-email').length > 0) {
      $(".field-name-field-comment-your-email input").attr("placeholder", "Your E-mail* (Your e-mail will not be displayed)");
    }
    if ($('.page-comment-reply .field-name-comment-body').length > 0) {
      $(".field-name-comment-body textarea").attr("placeholder", "Your Reply");
    }
    // Blog listing page: Exposed filters
    if ($('.page-newsroom-innovations .views-widget-filter-date_filter').length > 0) {
      $('.views-widget-filter-date_filter input').click(function() {
        $('input').parents('.form-item').addClass("highlight");
      });
    }
    if ($('.page-newsroom-innovations .views-widget-filter-combine').length > 0) {
      $(".views-widget-filter-combine input").attr("placeholder", "Search");
      $('.views-widget-filter-combine input').on('input',function(e){
        $('input').parents('.form-item').addClass("highlight");
      });
    }
    if ($('.page-newsroom-innovations .views-exposed-widget').length > 0) {
      if($('.views-exposed-widget .form-item.highlight').length > 0) {
        $('.blog-all-posts').hide();
      }
    }
    if ($('.staff-listing-page .staff-unpublished').length > 0) {
      $('.staff-unpublished .views-field-title a').contents().unwrap();
      $('.staff-unpublished .views-field-field-people-image a').contents().unwrap();
    }
    $('.staff-listing-page .views-field-body').each(function(){
      if (!$(this).text().trim().length) {
        $(this).parents('.staff-published').addClass("no-body-text");
      }
    });
    if ($('.staff-listing-page .no-body-text').length > 0) {
      $('.no-body-text .views-field-title a').contents().unwrap();
      $('.no-body-text .views-field-field-people-image a').contents().unwrap();
    }
    if ($('.view .staff-photo-hide').length > 0) {
      $('.staff-photo-hide .views-field-field-people-image img').hide();
      $('.staff-photo-hide .field-name-field-people-image img').hide();
    }
    
    /*if ($('.page-newsroom-innovations .views-widget-filter-field_project_region_tid').length > 0) {
      $('.views-widget-filter-date_filter').hide();
      $('.views-widget-filter-field_project_service_tid').hide();
      $('.views-widget-filter-field_project_region_tid').hide();
      if(!$('.ifi-more-filters').length > 0) {
        $(".views-submit-button").prepend('<div class="ifi-more-filters">More Filters</div>');
      }
      if($('.ifi-hide-filters').length > 0) {
        $('.views-widget-filter-date_filter').show();
        $('.views-widget-filter-field_project_service_tid').show();
        $('.views-widget-filter-field_project_region_tid').show();
      }
      $('.ifi-more-filters').click(function() {
        $('.views-widget-filter-date_filter').toggle();
        $('.views-widget-filter-field_project_service_tid').toggle();
        $('.views-widget-filter-field_project_region_tid').toggle();
        if($('.ifi-more-filters').hasClass("ifi-hide-filters")) {
          $('.ifi-more-filters').removeClass("ifi-hide-filters").text("More Filters");
        } else {
          $('.ifi-more-filters').addClass("ifi-hide-filters").text("Hide Filters");
        }
      });
    }*/
    // Customization to node comment form
    if ($('.title.comment-form').length > 0) {
      $('.title.comment-form').text('Leave a Reply');
      $('.title.comment-form').before('<p class="ifi-space-breaker"></p>');
    }
    if ($('.staff-listing-page .views-widget-filter-title').length > 0) {
      $(".views-widget-filter-title input").attr("placeholder", "Search for a name");
    }
    if ($('.staff-listing-page .views-widget-filter-combine').length > 0) {
      $(".views-widget-filter-combine input").attr("placeholder", "Search the directory");
    }
    if ($('.staff-listing-page .ctools-auto-submit-full-form').length > 0) {
      $('.ctools-auto-submit-full-form input.form-control').focusTextToEnd();
    }
    if ($('.node-type-project .field-name-field-project-director-overrides').length > 0) {
      $('.field-name-field-project-director-overrides > .field-items > .field-item').each(function() {
        if (!($(this).find('.field-name-field-director-name').length > 0)) {
          $(this).hide();
        }
      });
    }
    if ($('.node-type-project .field-name-field-experts-overrides').length > 0) {
      $('.field-name-field-experts-overrides > .field-items > .field-item').each(function() {
        if (!($(this).find('.field-name-field-expert-name').length > 0)) {
          $(this).hide();
        }
      });
    }
    if ($('.staff-contact-webform').length > 0) {
      $('.webform-client-form .form-actions').append('<button value="Reset" type="reset" class="webform-reset-btn">Cancel message</button>');
      $('.webform-reset-btn').click(function() {
        window.history.back();
      });
    }
    if ($('.front.page-node').length > 0) {
      if ($('#block-ifi-homepage-sp-ifi-homepage-header-images-sp').length > 0) {
        $('.main-container').addClass('homepage-sp-override');
        $('.front.page-node').addClass('sp-override');
      }
    }
    if ($('.res-covid-btn.this-home').length > 0) {
      $('.res-covid-btn.this-home').click(function(event){
        event.preventDefault();
      });
    }
  }
};

})(jQuery, Drupal, this, this.document);

(function($){
  $(document).ready(function(){
    if ($('.page-newsroom-innovations .views-widget-filter-field_project_body_of_work_tid').length > 0) {
      $('.views-widget-filter-field_project_body_of_work_tid .panel-body').hide();
      $('.views-widget-filter-field_project_body_of_work_tid .panel-title').click(function(event) {
        $('.views-widget-filter-field_project_body_of_work_tid .panel-body').toggle();
      });
    }
  });
})(jQuery);
$(document)
  .ready(function() {

    $.getJSON('//geoip.nekudo.com/api/', function(data) {
      if(data['country'] && data['country']['code'] == 'US') {
        $('.ui.modal.access-restriction').modal('show');
      }
    });
    var coins = ["BTC","ETH","RPL","SC",];
    $.getJSON('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + coins.join(',') +  '&tsyms=USD', function(data) {
      $("#ticker").empty();
      for(var index in data['DISPLAY']) {
        var object = data['DISPLAY'][index];
        var markers = [
          "<span style='color:green;'>PRICE: " + object['USD']['PRICE'],
          "<span style='color:red;'>HIGH: " + object['USD']['HIGH24HOUR'],
          "<span style='color:blue;'>LOW: " + object['USD']['LOW24HOUR'],
          "<span style='color:purple;'>VOL: " + object['USD']['MKTCAP'],
        ];
        var tick = $("<div>")
                    .addClass("ticker__item")
                    .html(index + " (" + markers.join(", ") + ")");
        $("#ticker").append(tick);
      }
    });

    // fix menu when passed
    $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      });

    $('.overlay').visibility({
      type: 'fixed',
      offset: 80,
      onFixed: function() {
        $(this).css("top", "calc(100% - 25px - 1.5em)");
      },
      onUnfixed: function() {
        $(this).css("top", "");
      }
    });

    // lazy load images
    $('.image').visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
    });

    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item');

    var dp = null;
    var initDp  = false;
    // show dropdown on hover
    $('.main.menu .ui.dropdown').dropdown({
      on: 'hover',
      transition: 'swing down',
      onChange: function(value, text, $choice) {
        if($choice.attr("data-type") == "link" && $("#" + value).length != 0) {
          $('html, body').animate({
            "scrollTop": $("#" + value).offset().top
          }, "fast");
        }
        if($choice.attr("data-type") == "lang") {
          i18next.changeLanguage(value, function (err, t) {
            i18next_render(err, t);
            if (err) {
              return console.log('something went wrong loading', err);
            }
          });
        }

        if($choice.attr("data-type") == "link-root") {
          document.location = "/#" + value;
        }
      }
    });

    $('.ui.accordion').accordion();

    i18next
    	.use(window.i18nextBrowserLanguageDetector)
      .use(window.i18nextXHRBackend)
    	.init({
        backend: {
          // for all available options read the backend's repository readme file
          loadPath: 'locales/{{lng}}/{{ns}}.json',
          whitelist: ['en', 'ch', 'de', 'es', 'ru', 'ko', 'jp'],
          fallbackLng: 'en'
        }
    	}, function(err, t) {
        i18next_render(err, t);
        $('.ui.dropdown.language').dropdown('set selected', [i18next.language.split('-')[0]]);
      });

      var i18next_render = function(err, t) {
      if(i18next.language == 'cn') {
        moment.locale('zh-cn');
      } else {
        moment.locale(i18next.language);
      }

      // initialized and ready to go!
      var names = [ "i18n-top",
                    "i18n-description",
                    "i18n-api",
                    "i18n-channels",
                    "i18n-faq",
                    "i18n-signin-signup",
                    "i18n-escb-title",
                    "i18n-advancement-1",
                    "i18n-advancement-2",
                    "i18n-advancement-3",
                    "i18n-advancement-4",
                    "i18n-advanced-ui",
                    "i18n-main-documents",
                    "i18n-unsubscribe",
                    "i18n-e-mail",
                    "i18n-submit",
                    "i18n-form-completed",
                    "i18n-form-completed-subscription",
                    "i18n-form-warning",
                    "i18n-form-warning-subscription",
                    "i18n-faq-1-title",
                    "i18n-faq-1-content",
                    "i18n-faq-2-title",
                    "i18n-faq-2-content",
                    "i18n-faq-3-title",
                    "i18n-faq-3-content",
                    "i18n-faq-4-title",
                    "i18n-faq-4-content",
                    "i18n-faq-5-title",
                    "i18n-faq-5-content",
                    "i18n-faq-6-title",
                    "i18n-faq-6-content",
                    "i18n-faq-7-title",
                    "i18n-faq-7-content",
                    "i18n-whitepaper",
                    "i18n-terms-conditions",
                    "i18n-privacy-policy",
                    "i18n-rights",
                    "i18n-risk-warning",
                    "i18n-access-restriction",
                    "i18n-access-restriction-detected",
                    "i18n-access-restriction-body",
                    "i18n-access-restriction-right",
                    "i18n-access-restriction-no-use",
                    "i18n-access-restriction-right-use"
                 ];

      for(var i in names) {
        $("." + names[i]).html(i18next.t(names[i]));
      }

      $('.i18n-e-mail').attr('placeholder', i18next.t('i18n-e-mail'));

      document.title = i18next.t('i18n-title-page');
    }

    /**
     * Form validations
    **/
    $('.ui.form.subscription')
    .form({
      fields: {
        'email-subscription': {
          identifier : 'email-subscription',
          rules: [
            {
              type   : 'email',
              prompt : i18next.t('i18n-e-mail-invalid')
            }
          ]
        }
      }
    });

    $('.ui.form.subscription')
    .form({
      fields: {
        'email': {
          identifier : 'email',
          rules: [
            {
              type   : 'email',
              prompt : i18next.t('i18n-e-mail-invalid')
            }
          ]
        }
      },
      onSuccess: function(event, fields) {
        event.preventDefault();

        if(typeof(gtag) != "undefined") {
          // track conversion in GA
          gtag('send',
            {
              hitType: 'event',
              eventCategory: 'subscription',
              eventAction: 'send',
              eventLabel: 'main'
            }
          );
        }

        // Use Ajax to submit form data
        var url = 'https://script.google.com/macros/s/AKfycbyWWk0VdKJUIT1ghU1d7JC3jHOvKRJA5FvSIQYwHlSqIaNlceFl/exec';
        // show the loading
        $('.subscription').addClass('loading');
        var jqxhr = $.post(url, fields, function(data) {
           console.log("Success! Data: " + data.statusText);
           $('.subscription').removeClass('loading').addClass('success');
        })
        .fail(function(data) {
           console.warn("Error! Data: " + data.statusText);
           $('.subscription').removeClass('loading');
           // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
           if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
               //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
               console.log("Success! Data: " + data.statusText);
               //Success!
               $('.subscription').addClass('success');
           } else {
             $('.subscription').addClass('warning');
           }
        });
      }
    });
});

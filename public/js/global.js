(function(window, undefined) {

	var that = this;

	/**
	 * @function
	 *
	 */
	that.initElements = function() {
		that.el = {
			$portfolio 	  : $("#portfolio"),
            $portfolioNav : $("#portfolio-nav"),
            $referencesRow: $("#references .row")
		};
	};



	/**
	 * @function
	 *
	 */
	that.initPortfolioBlur = function() {

		// No webgl support
		if( ! Modernizr.webgl ) return;

		// For each card
		that.el.$portfolio.find(".js-card.js-active").each(function(i, card) {

 			var $card = $(card);
			// If there already is canvas or no image
			if( $card.find("canvas").length || !$card.find("img").length ) return;

      // creates a Canvas with the size of the preview
  	  try {
          var canvas = fx.canvas();
      } catch(e) {      		
          // Just stops if it failled
          return console && console.log(e.message);
      }

      canvas.width = $card.width();
      canvas.height = $card.height();

      var img     = $card.find("img:first")[0],
          texture = canvas.texture(img);

      canvas.draw(texture).lensBlur(5, 1, 0).update();            

      // append the canvas to the current preview
      $card.find(".wrapper").append(canvas);

		});

	};

    /**
     * 
     */
    that.toggleReferences = function() {
        var spanToToggle = Math.round(Math.random()*4);
        var rowToShow = Math.round(Math.random()*2);
        that.el.$referencesRow.each(function(i, row) {
            $(row).find(".span2").eq(spanToToggle).toggleClass("active", i == rowToShow);
        });
    };

	/**
	 * @function
	 *
	 */
	that.changePortfolioNav = function(slide, i) {
		that.el.$portfolioNav.find("li").removeClass("active").eq(i).addClass("active");
	};

	/**
	 * @function
	 *
	 */
	that.initPortfolio = function() {
	
		var option = {                
	      child_class: ".js-card"
    	, startSlide:0
    	, overflow: "visible"
		},
		$wrappers = that.el.$portfolio.find(".wrapper"),
		$cards = that.el.$portfolio.find(".js-card").css("width", that.el.$portfolio.innerWidth() ),
		// Determine the portfolio height according the width
		height = $wrappers.outerWidth() * 0.5;

		// Change the wrappers height
		$wrappers.css("height", height);		
		that.el.$portfolio.find(".about .row").css("height", height);

		// First time we initialize the portfolio
		if( that.el.$portfolio.data("µSlide") ) {
			
			// Reset the previous one
			that.el.$portfolio.data("µSlide").init();

		// Not the first time we initialize the portfolio
		} else {
			that.el.$portfolio
			// Define a slide
			.µSlide(option)
			// Event after the slide to update the bullet list
			.on("after-slide", that.changePortfolioNav)
			// Flip event (open)
			.on("click touchend", ".legend, .legend .btn", function() {				
				// Stops auto slide
				if(that.autoSlide) clearInterval( that.autoSlide );
				$(this).parents(".js-card").addClass("fliped");
			})
			// Flip event (close)
			.on("click touchend", ".about .back, .about h3:first", function() {
				$(this).parents(".js-card").removeClass("fliped");
			})
			// Stop auto slide
			.on("mousedown touchstart", function() {				
				if(that.autoSlide) clearInterval( that.autoSlide );
			});

			// Bullets navigation
			that.el.$portfolioNav.delegate("li", "click", function(el) {
				// Stops auto slide
				if(that.autoSlide) clearInterval( that.autoSlide );
				that.el.$portfolio.data("µSlide").slideTo( $(this).index() );
			});

			// Auto slide after 3000 milliseconds
			that.autoSlide = setInterval(function() {

				that.el.$portfolio.data("µSlide").slideTo("next");

			}, 4000);
		}



	};


	/**
	 * @function
	 *
	 */
	that.slabTextHeadlines = function() {
		$(".slabtexted").slabText();
	};

	/**
	 * @function
	 *
	 */
	$(that.init = function() {	
		// iOs detection
		if( navigator.userAgent.match(/(iphone|ipod|ipad)/i) != null ) $("html").addClass("ios");
		// webKit detection
		if( navigator.userAgent.match(/(webkit)/i) != null ) $("html").addClass("webkit");
		
		that.initElements();
		
		if( that.el.$portfolio.length > 0 ) {
            that.initPortfolio();
		    $(window).on("resize", that.initPortfolio);
    		$(".lettering").lettering();
    		$(".lettering-lines").lettering('lines');
    		$(".lettering-words").lettering('words');
    		setTimeout(that.slabTextHeadlines, 1000);
        }

        setInterval(that.toggleReferences, 1500);


		// Smooth anchor scrolling
    $("a[href^='#']").on("click", function(event) {

      event.preventDefault();
      
      var $this = $(this),
          target = this.hash,
          $target = $(target),
          scrollElement = 'html, body';

      if(target === "" || target === "#") return;

      $(scrollElement).stop().animate({
          'scrollTop': $target.offset().top // minus the height of the fixed top menu
      }, 500, 'linear', function() {
      	window.location.hash = target;
      });

      return false;
        
    }); 

		// Open external links in a new tab
		$("a[rel$='external']").on("click", function(){
		     this.target = "_blank";
		});

	});

})(window);



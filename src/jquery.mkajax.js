/*
MKAjax v1.0.1
Copyright (c) 2013, 2014 Mikhail Kelner
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
(function($){
    jQuery.fn.mkajax = function(options){
        var options = $.extend({
			removeObject: false,
			resetForm: false,
			checkboxDefaultValue: 1,
			radioDefaultValue: 1,
			loadingAnimationTimeout: 0,
			onRequestSuccess: function($a,response){
				response = options.onRequestSuccessResponseHandling(response);
				var action = ($a.context.tagName.toLowerCase() == 'form') ? $a.attr('action') : $a.attr('href');
				var destination = false;
				if ($a.attr('data-result') && ($a.attr('data-result').length > 0)){
					destination = $a.attr('data-result');
				}
				options.onRequestSuccessSetResult(destination,response);
			},
			onRequestSuccessResponseHandling: function(response){
				return response;
			},
			onRequestSuccessSetResult: function(destination,response){
				if (destination && (destination.length > 0)){
					$(destination).html(response);
				} else {
					alert(response);
				}
			},
			onRequestError: function(destination,response){
				alert('Ajax request error.');
			},
			initLoadingAnimation: function(object){
				$(object).addClass('mkajax-loading');
				if (options.loadingAnimationTimeout > 0){
					setTimeout(function(){
						if ($(object).hasClass('mkajax-loading')){
							options.startLoadingAnimation(object);
						}
					},options.loadingAnimationTimeout);
				} else {
					options.startLoadingAnimation(object);
				}
			},
			startLoadingAnimation: function(object){
				$($(object).attr('data-result')).addClass('mkajax-loader-animation');
			},
			stopLoadingAnimation: function(object,response){
				$($(object).attr('data-result')).removeClass('mkajax-loader-animation');
			}
        }, options);
		var make = function(){
			var $plugin = $(this);
			$plugin.addClass('mkajax-binded');
			var action = '';
			if ($plugin.context.tagName.toLowerCase() == 'form'){
				action = $plugin.attr('action');
				$plugin.on('submit',function(){
					var $form = $(this);
					var url = $form.attr('data-action') && ($form.attr('data-action').length > 0)
								? $form.attr('data-action')
								: $form.attr('action')
							;
					var data = '';
					$form.find('input, button, select, textarea').each(function(){
						if ($(this).attr('name') && $(this).attr('name').length){
							var add = false;
							var value = '';
							if ($(this).attr('type') && ($(this).attr('type') == 'checkbox')){
								if ($(this).is(':checked')){
									add = true;
									value = $(this).val();
									if (value.length == 0){
										value = options.checkboxDefaultValue;
									}
								}
							} else if ($(this).attr('type') && ($(this).attr('type') == 'radio')){
								if ($(this).is(':checked')){
									add = true;
									value = $(this).val();
									if (value.length == 0){
										value = options.radioDefaultValue;
									}
								}
							} else {
								add = true;
								value = $(this).val();
							}
							if (add){
								data += (data.length > 0 ? '&' : '') + $(this).attr('name') + '=' + encodeURIComponent(value);
							}
						}
					});
					$.ajax({
						'url': url,
						'type': $form.attr('method'),
						'data': data,
						'cache': false,
						'beforeSend': function(response){
							$form.find('button, input[type="submit"]').addClass('mkajax-form-button-disabled').attr('disabled',true);
							options.initLoadingAnimation($form);
						},
						'error': function(response){
							$form.removeClass('mkajax-loading');
							options.stopLoadingAnimation($form,response);
							options.onRequestError($form,response);
						},
						'success': function(response){
							$form.find('.mkajax-form-button-disabled').removeClass('mkajax-form-button-disabled').attr('disabled',false);
							$form.removeClass('mkajax-loading');
							options.stopLoadingAnimation($form,response);
							options.onRequestSuccess($form,response);
							if (options.removeObject){
								$form.remove();
							}
							if (options.resetForm){
								$form.trigger('reset');
							}
						}
					});
					return false;
				});
			} else {
				action = $plugin.attr('href');
				$plugin.on('click',function(){
					var $a = $(this);
					var url = $a.attr('data-action') && ($a.attr('data-action').length > 0)
							? $a.attr('data-action')
							: $a.attr('href')
						;
					$.ajax({
						'url': url,
						'cache': false,
						'beforeSend': function(){
							options.initLoadingAnimation($a);
						},
						'error': function(response){
							$a.removeClass('mkajax-loading');
							options.stopLoadingAnimation($a,response);
							options.onRequestError($a,response);
						},
						'success': function(response){
							$a.removeClass('mkajax-loading');
							options.stopLoadingAnimation($a,response);
							options.onRequestSuccess($a,response);
							if (options.removeObject){
								$a.remove();
							}
						}
					});
					return false;
				});
			}
			if (!($plugin.attr('data-result') && ($plugin.attr('data-result').length > 0))){
				if (action.indexOf('#') >= 0){
					$plugin.attr('data-result',('#' + action.split('#')[1]));
				}
			}
			return $plugin;
		};
		return this.each(make);
	};
})(jQuery);
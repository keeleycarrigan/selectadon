;(function ($, window, document, undefined) {
    var pluginName = 'selectadon',
        extObj = {}, // Object used to extend jQuery's pseudo selector.
        defaults = {
            selectData: {},
            holderClass: 'sd-holder',
            modifierClass: '',
            btnClass: 'sd-btn',
            listClass: 'sd-list',
            txtClass: 'sd-text',
            selectedClass: 'sd-selected',
            iconClass: 'sd-icon',
            openClass: 'open',
            dataOptName: 'sd-options',
            iconFirst: false,
            btnTxt: null,
            btnIcon: null,
            noBtnTxt: false,
            noBtnIcon: false,
            closeAll: true,
            showEvt: 'click',
            evtNamespace: '',
            onInit: $.noop,
            onCreate: $.noop,
            onOpen: $.noop,
            onSelect: $.noop,
            onClose: $.noop
        },
        isTouchDevice = (function () {
            return true === ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
        })(),
        clickAction = isTouchDevice ? 'touchstart' : 'click',
        isPluginType = function (el) {
            return typeof($(el).data('plugin_' + pluginName)) === 'object';
        },
        getTrueValue = function (val) {
            var trueVal = parseInt(val, 10);

            if (isNaN(trueVal)) {
                switch (val) {
                case 'null':
                    trueVal = null;
                    break;
                case 'true':
                    trueVal = true;
                    break;
                case 'false':
                    trueVal = false;
                    break;
                case 'undefined':
                    trueVal = undefined;
                    break;
                default:
                    trueVal = val;
                    break;
                }
            }

            return trueVal;
        };

    extObj[pluginName] = function (el, index, meta) {
        if (meta[3] && isPluginType(el)) {
            var inputOpts = meta[3].split(':'),
                pluginOpts = $.data(el, 'plugin_' + pluginName)['options'][inputOpts[0]];

            if (inputOpts.length > 1) {
                return pluginOpts === getTrueValue(inputOpts[1]);
            } else {
                return pluginOpts;
            }
        } else {
            return isPluginType(el);
        }
    };

    $.extend($.expr[':'], extObj);
    
    $(document).on(clickAction + '.sd-close', function (e) {
        $(':' + pluginName + '("isOpen")')[pluginName]('dismiss', [e]);
    });

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(this.el);
        this.selectOptions = {};
        defaults.btnTxt = this.$el.find('option').eq(0).text();
        this.options = $.extend({}, defaults, options);

        var dataOptions = this.$el.data(this.options.dataOptName) || {};

        this.options = $.extend({}, this.options, dataOptions);
        this.options.isOpen = false;
        this.options.onInit(this);
        this._name = pluginName;

        if ($.trim(this.options.evtNamespace) !== '') {
            this.options.evtNamespace = '.' + this.options.evtNamespace;
        }

        this.init();
    }
    
    Plugin.prototype = {
        init: function () {
            // Bind events needed for plugin.
            this.$el.on('change' + this.options.evtNamespace, {self: this}, this.hiddenSelectActions);

            // Build object from options to build new dropdown elements.
            this.getSelectContent();

            this.options.onCreate(this);
        },
        getSelectContent: function () {
            var $options = this.$el.find('option'),
                optLength = $options.length,
                optData = {};

            if (optLength > 0) {
                for (i = 0; i < optLength; i += 1) {
                    /**
                        Adding an underscrore in case the value of an option is a
                        number. Objects don't like numbers as keys.
                    **/
                    optData['_' + $.trim($options.eq(i).attr('value'))] = $options.eq(i).text();
                }
            }

            this.selectOptions = $.extend({}, optData, this.options.selectData);

            this.buildSelect();
        },
        buildSelect: function () {
            var selectId = this.$el.attr('id'),
                $sdHolder = $('<div>', {'class': $.trim(this.options.holderClass + ' ' + this.options.modifierClass), 'data-id': selectId}),
                $sdBtn = $('<a>', {'class': this.options.btnClass}),
                $sdBtnTxt = this.options.noBtnTxt === true ? null : $('<span>', {'class': this.options.txtClass, 'text': this.options.btnTxt}),
                $sdBtnIcon = this.options.noBtnIcon === true ? null : $('<span>', {'class': this.options.iconClass, 'html': this.options.btnIcon}),
                $sdList = $('<ul>', {'class': this.options.listClass}),
                sdBtnOrder = this.options.iconFirst === true ? [$sdBtnIcon, $sdBtnTxt] : [$sdBtnTxt, $sdBtnIcon],
                optionEls = '';

            $sdHolder
            .insertAfter(this.$el)
            .append([$sdBtn.append(sdBtnOrder), $sdList])
            .on(clickAction + this.options.evtNamespace, 'a', {self: this}, this.optionListActions);
            
            if (this.options.showEvt === 'hover' && !isTouchDevice) {
                $sdHolder.on('mouseenter' + this.options.evtNamespace + ' ' + 'mouseleave' + this.options.evtNamespace, {self: this}, this.optionListActions);
            }

            this.$el.detach().prependTo($sdHolder);
            this.$sdHolder = $sdHolder;

            for (var option in this.selectOptions) {
                optionEls += '<li><a href="#" data-value="' + option.split('_')[1] + '">' + this.selectOptions[option] + '</a></li>';
            }

            $sdList.append(optionEls);

        },
        hiddenSelectActions: function (e, extra) {
            var self = e.data.self;

            /**
                'extra' is sent only when the option sync triggers a select change.
                When this is done we don't want to fire that method again.
            **/
            if (!extra) {
                self.syncSelectedOption(self.$el.val(), e.type);
            }
        },
        optionListActions: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var self = e.data.self,
                $target = $(e.currentTarget),
                optVal;

            if (e.type === 'click' || e.type === 'touchstart') {
                if (!$target.hasClass(self.options.btnClass)) {
                    optVal = $target.data('value');

                    self.syncSelectedOption(optVal, 'click');
                }

                if (self.$sdHolder.hasClass(self.options.openClass)) {
                    self.hide();
                } else {
                    self.show();
                }
            } else {
                if (e.type === 'mouseenter') {
                    self.show();
                } else {
                    self.hide();
                }
            }
        },
        show: function (e) {
            var self = e ? e.data.self : this;

            // Close all currently open dropdowns.
            if (self.options.closeAll) {
                $(':' + pluginName + '("isOpen")')[pluginName]('hide');
            }

            self.$sdHolder.addClass(self.options.openClass);
            self.options.onOpen(self);
            self.options.isOpen = true;
        },
        hide: function (e) {
            var self = e ? e.data.self : this;

            self.$sdHolder.removeClass(self.options.openClass);
            self.options.onClose(self);
            self.options.isOpen = false;
        },
        dismiss: function (e) {
            /**
            *   This is purely to stop click/touch events from bubbling so
            *   content inside the dropdown can be clicked and not close it.
            **/
            
            if ($(e.target).parents('.' + this.options.holderClass).length > 0) {
                e.stopPropagation();
            } else {
                this.hide();
            }
        },
        /**
            This function keeps the real select element and the generated dropdown
            in sync so either can be used to select an option.
        **/
        syncSelectedOption: function(value, eventType) {
            var btnTxt = !value || value === '' ? this.options.btnTxt : this.selectOptions['_' + value],
                selectVal = !value || value === '' ? '' : value;

            this.$sdHolder.find('.' + this.options.txtClass).text(btnTxt).end().find('[data-value="' + selectVal + '"]').addClass(this.options.selectedClass);

            if (eventType === 'click') {
                this.$el.val(selectVal).trigger('change' + this.options.evtNamespace, [true]);
            }

            this.options.onSelect(this, value);
        },
        destroy: function () {
            this.$el.off('change' + this.options.evtNamespace).detach().insertBefore(this.$sdHolder);
            this.$sdHolder.remove();
        },
        create: function () {
            this.init();
        }
    };

    $.fn[pluginName] = function (options, args) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            } else if ($.isFunction(Plugin.prototype[options]) && options.indexOf('_') < 0) {
                // Possibly be refactored, but allows passing multiple arguments to methods
                var thePlugin = $.data(this, 'plugin_' + pluginName);
                // So IE8 doesn't freak out if you don't pass anything to apply as an argument.
                args = args || [];

                thePlugin[options].apply(thePlugin, args);
            }
        });
    };

})(jQuery, window, document);
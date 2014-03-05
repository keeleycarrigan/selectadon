;(function ($, window, document, undefined) {
    var pluginName = 'selectadon',
        defaults = {
            selectData: {},
            holderClass: 'sd-holder',
            btnClass: 'sd-btn',
            listClass: 'sd-list',
            txtClass: 'sd-text',
            iconClass: 'sd-icon',
            openClass: 'open',
            iconFirst: false,
            btnTxt: null,
            btnIcon: '&#9660;',
            noBtnTxt: false,
            noBtnIcon: false
        };

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(this.el);
        this.selectOptions = {};
        defaults.btnTxt = this.$el.find('option').eq(0).text();

        var dataOptions = this.$el.data('sd-options');

        if (dataOptions) {
            options = $.extend({}, options, dataOptions);
        }
        this.options = $.extend({}, defaults, options);
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
        this.$el.hide();

        this.getSelectContent();
    };

    Plugin.prototype.getSelectContent = function () {
        var $options = this.$el.find('option'),
            optLength = $options.length,
            optData = {};

        if (optLength > 0) {
            for (i = 0; i < optLength; i += 1) {
                optData[$.trim($options.eq(i).attr('value'))] = $options.eq(i).text();
            }
        }

        this.selectOptions = $.extend({}, optData, this.options.selectData);

        this.buildSelect();
    };

    Plugin.prototype.buildSelect = function () {
        var selectId = this.$el.attr('id'),
            $sdHolder = $('<div>', {'class': this.options.holderClass, 'data-id': selectId}),
            $sdBtn = $('<a>', {'class': this.options.btnClass}),
            $sdBtnTxt = this.options.noBtnTxt === true ? null : $('<span>', {'class': this.options.txtClass, 'text': this.options.btnTxt}),
            $sdBtnIcon = this.options.noBtnIcon === true ? null : $('<span>', {'class': this.options.iconClass, 'html': this.options.btnIcon}),
            $sdList = $('<ul>', {'class': this.options.listClass}),
            sdBtnOrder = this.options.iconFirst === true ? [$sdBtnIcon, $sdBtnTxt] : [$sdBtnTxt, $sdBtnIcon];

        $sdHolder
        .insertAfter(this.$el)
        .append([$sdBtn.append(sdBtnOrder), $sdList])
        .on('click.sd touchstart.sd', 'a', {self: this}, this.selectActions);

        for (var option in this.selectOptions) {
            var $option = $('<li><a href="#" data-value="' + option + '">' + this.selectOptions[option] + '</a></li>');

            $option.appendTo($sdList);
        }

    }

    Plugin.prototype.selectActions = function  (e) {
        e.preventDefault();

        var self = e.data.self,
            $clicked = $(e.currentTarget),
            $select = $clicked.parents('.' + self.options.holderClass),
            selectId = $select.data('id'),
            optVal;

        if (!$clicked.hasClass('sd-btn')) {
            optVal = $clicked.data('value');

            $('#' + selectId).val(optVal).change();
            $select.find('.' + self.options.txtClass).text($clicked.text());
        }

        $select.toggleClass(self.options.openClass);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
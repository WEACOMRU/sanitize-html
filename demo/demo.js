(function ($) {
    'use strict';

    $(function () {
        var $body = $('body'),
            $ruleList = $('.js-rule-list', $body),
            $protoRule = $('.js-rule-list_i-proto', $ruleList),
            ruleIdCounter = 0,
            $ruleListPreview = $('.js-rule-list-preview', $body),
            content = document.getElementById('content'),

            valid_elements = {},

            inputKeyUpResponse,
            $defaultRule,

            resizePreview = function () {
                $ruleListPreview.outerHeight($ruleList.height());
            },

            showPreview = function () {
                var indent = '&nbsp;&nbsp;&nbsp;&nbsp;',
                    linebreak = '<br>',
                    result = 'valid_elements = {',
                    tags, rule;

                for (tags in valid_elements) {
                    if (valid_elements.hasOwnProperty(tags)) {
                        result += linebreak + indent + '\'' + tags + '\': {';

                        rule = valid_elements[tags];

                        if (typeof rule.valid_styles !== 'undefined') {
                            result += linebreak + indent + indent + 'valid_styles: \'' + rule.valid_styles + '\',';
                        }

                        if (typeof rule.valid_classes !== 'undefined') {
                            result += linebreak + indent + indent + 'valid_classes: \'' + rule.valid_classes + '\',';
                        }

                        if (rule.no_empty) {
                            result += linebreak + indent + indent + 'no_empty: true';
                        }

                        result += linebreak + indent + '},';
                    }
                }

                result += linebreak + '}';

                $ruleListPreview.html(result);
            },

            collectRules = function () {
                valid_elements = {};

                $('.js-rule-list_i', $ruleList).each(function () {
                    var $rule = $(this),
                        tags = $('.js-rule-list_i_tags', $rule).val(),
                        $styles = $('.js-rule-list_i_styles', $rule),
                        $classes = $('.js-rule-list_i_classes', $rule),
                        $no_empty = $('.js-rule-list_i_no-empty', $rule);

                    if (tags) {
                        valid_elements[tags] = {};

                        if ($('.js-rule-list_i_toggle_check', $styles.prev()).prop('checked')) {
                            valid_elements[tags].valid_styles = $styles.val();
                        }

                        if ($('.js-rule-list_i_toggle_check', $classes.prev()).prop('checked')) {
                            valid_elements[tags].valid_classes = $classes.val();
                        }

                        if ($no_empty.prop('checked')) {
                            valid_elements[tags].no_empty = true;
                        }
                    }
                });

                showPreview();
            },

            addRule = function () {
                var $rule = $protoRule.clone();

                $('.js-rule-list_i_tags', $rule)
                    .attr('id', 'rule-' + ruleIdCounter + '-tags')
                    .prev()
                        .attr('for', 'rule-' + ruleIdCounter + '-tags');

                $('.js-rule-list_i_styles', $rule)
                    .attr('id', 'rule-' + ruleIdCounter + '-styles')
                    .prev()
                        .attr('for', 'rule-' + ruleIdCounter + '-styles');

                $('.js-rule-list_i_classes', $rule)
                    .attr('id', 'rule-' + ruleIdCounter + '-classes')
                    .prev()
                        .attr('for', 'rule-' + ruleIdCounter + '-classes');

                ruleIdCounter++;

                $rule
                    .removeClass('hidden js-rule-list_i-proto')
                    .addClass('js-rule-list_i');

                $ruleList.append($rule);

                resizePreview();

                return $rule;
            },

            toggleField = function ($element, bool) {
                var elementTagName,
                    $field, $check;

                if ($element instanceof $) {
                    elementTagName = $element.get(0).tagName.toLowerCase();
                } else {
                    elementTagName = $element.tagName.toLowerCase();
                    $element = $($element);
                }

                if (elementTagName === 'label') {
                    $field = $element.next();
                    $check = $('.js-rule-list_i_toggle_check', $element);
                } else if (elementTagName === 'input') {
                    $field = $element;
                    $check = $('.js-rule-list_i_toggle_check', $field.prev());
                }

                if ($check && $field) {
                    if (typeof bool === 'undefined') {
                        bool = !$check.prop('checked');
                    }

                    $check.prop('checked', bool);
                    $field.prop('disabled', !bool);

                    collectRules();
                }
            };


        /* Назначение обработчиков событий
         -------------------------------------------------- */
        $body.on('click', '.js-add-rule', function (e) {
            e.preventDefault();
            addRule();
        });

        $ruleList.on('click', '.js-rule-list_i_toggle', function () {
            toggleField(this);
        });

        $ruleList.on('keyup', 'input[type="text"]', function () {
            if (inputKeyUpResponse) {
                clearTimeout(inputKeyUpResponse);
            }

            inputKeyUpResponse = setTimeout(function () {
                inputKeyUpResponse = null;
                collectRules();
            }, 1000);
        });

        $ruleList.on('click', '.js-rule-list_i_no-empty', collectRules);

        $ruleList.on('click', '.js-rule-list_i_delete', function () {
            $(this).parents('.js-rule-list_i').remove();
            resizePreview();
            collectRules();
        });

        $body.on('click', '.js-formatting', function (e) {
            e.preventDefault();
            htmlFormatting(content, valid_elements);
        });

        $body.on('click', '.js-field-clear', function (e) {
            e.preventDefault();
            content.innerHTML = '';
        });


        /* Установка правил по-умолчанию
         -------------------------------------------------- */
        $defaultRule = addRule();
        $('.js-rule-list_i_tags', $defaultRule).val('h1,h2,h3');
        toggleField($('.js-rule-list_i_styles', $defaultRule));
        toggleField($('.js-rule-list_i_classes', $defaultRule));
        $('.js-rule-list_i_no-empty', $defaultRule).prop('checked', true);

        $defaultRule = addRule();
        $('.js-rule-list_i_tags', $defaultRule).val('p');
        toggleField($('.js-rule-list_i_styles', $defaultRule).val('text-align'));
        toggleField($('.js-rule-list_i_classes', $defaultRule));
        $('.js-rule-list_i_no-empty', $defaultRule).prop('checked', true);

        collectRules();
    });
})(jQuery);


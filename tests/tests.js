var test = function (input, output, valid_elements) {
    'use strict';

    var node = document.createElement('div');
    node.innerHTML = input;
    htmlFormatting(node, valid_elements);

    return node.innerHTML === output;
};

QUnit.test('html-formatting', function (assert) {
    'use strict';

    var input, output, valid_elements;

    input = '<h1>Hello, World!</h1><p style="text-align: center;">It\'s a test!</p>';
    output = input;
    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        },
        'p': {
            valid_styles: 'text-align',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Соответствие правилам');


    input = '<h1>Hello, World!</h1>' +
            '<p style="text-align: center; font-size: 1.1em; line-height: 1.3; color: gray;">It\'s a test!</p>';

    output = '<h1>Hello, World!</h1>' +
             '<p style="text-align: center; color: gray;">It\'s a test!</p>';

    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        },
        'p': {
            valid_styles: 'text-align,color',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Разрешенные стили');


    input = '<h1 class="ui ui-title title news-title __big-title">Hello, World!</h1>' +
            '<p class="caption" style="text-align: center;">It\'s a test!</p>';

    output = '<h1 class="title __big-title">Hello, World!</h1>' +
             '<p style="text-align: center;">It\'s a test!</p>';

    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: 'title __big-title',
            no_empty: true
        },
        'p': {
            valid_styles: 'text-align,color',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Разрешенные классы');


    input = '<h1>Hello, World!</h1><p style="text-align: center;">It\'s a test!</p><p>&nbsp;</p><p>Done!</p>';
    output = '<h1>Hello, World!</h1><p style="text-align: center;">It\'s a test!</p><p>Done!</p>';
    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        },
        'p': {
            valid_styles: 'text-align',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Удаление пустых элементов');


    input = '<h1 id="article-title">Hello,&nbsp;World!</h1>' +
            '<p id="caption" style="text-align: center;">It\'s&nbsp;a&nbsp;test!</p>';

    output = '<h1>Hello, World!</h1>' +
             '<p style="text-align: center;">It\'s a test!</p>';

    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        },
        'p': {
            valid_styles: 'text-align',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Удаление идентификаторов и неразрывных пробелов');


    input = '<h1><em style="font-size: 1.1em;">Hello</em>, <strong>World</strong>!</h1>' +
            '<p style="text-align: center;">It\'s a <strong>test</strong>!</p>';

    output = '<h1><i>Hello</i>, World!</h1>' +
             '<p style="text-align: center;">It\'s a <b>test</b>!</p>';

    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true,

            valid_elements: {
                'em': {
                    convert_to: 'i',
                    valid_styles: '',
                    valid_classes: '',
                    no_empty: true
                }
            }
        },
        'p': {
            valid_styles: 'text-align',
            valid_classes: '',
            no_empty: true
        },
        'strong': {
            convert_to: 'b',
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Конвертирование + вложенные правила');


    input = '<h1>Hello, World!</h1>' +
            '<p style="text-align: center;">' +
                'It\'s a test! Go to <a href="https://google.com">Google</a>' +
            '</p>';

    output = '<h1>Hello, World!</h1>' +
             '<p style="text-align: center;">' +
                'It\'s a test! Go to <a target="_blank" href="https://google.com">Google</a>' +
             '</p>';

    valid_elements = {
        'h1': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        },
        'p': {
            valid_styles: 'text-align',
            valid_classes: '',
            no_empty: true
        },
        'a': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true,

            process: function (node) {
                node.target = '_blank';
            }
        }
    };
    assert.ok(test(input, output, valid_elements), 'Дополнительная обработка');


    input = '<h1 id="article-title">' +
                'Hello,<br><a style="color: blue;" href="https://msn.com/"><strong>World</strong></a>!' +
            '</h1>' +
            '<p class="caption overflow" style="text-align: center; color: gray;">' +
                'It\'s a <strong style="font-weight: normal;">good</strong> test!' +
            '</p>' +
            '<p style="text-align: center;">&nbsp;</p><br class="line-break">' +
            '<p style="text-align: center;">' +
                'Go&nbsp;<em class="text-decoration: underline;">to</em>&nbsp;' +
                '<a href="https://google.com">Google</a><strong></strong>.<br>' +
                'Done!' +
            '</p>';

    output = '<h2>Hello, <a href="http://msn.com/">World</a>!</h2>' +
             '<p class="caption">It\'s a <b>good</b> test!</p>' +
             '<br>' +
             '<p>' +
                'Go <em class="text-decoration: underline;">to</em> ' +
                '<a target="_blank" href="https://google.com">Google</a>.<br>' +
                'Done!' +
             '</p>';

    valid_elements = {
        'h1': {
            convert_to: 'h2',
            valid_styles: '',
            valid_classes: '',
            no_empty: true,

            valid_elements: {
                'a': {
                    valid_styles: '',
                    valid_classes: '',

                    process: function (node) {
                        node.href = node.href.replace('https://', 'http://');
                    }
                },
                'br': {
                    valid_styles: '',
                    valid_classes: '',

                    process: function (node) {
                        var parent = node.parentNode,
                            space = document.createTextNode(' ');

                        parent.replaceChild(space, node);
                    }
                }
            }
        },
        'p': {
            valid_styles: '',
            valid_classes: 'caption',
            no_empty: true,

            valid_elements: {
                'em': {
                    no_empty: true
                },
                'strong': {
                    convert_to: 'b',
                    valid_styles: '',
                    valid_classes: '',
                    no_empty: true
                },
                'a': {
                    valid_styles: '',
                    valid_classes: '',
                    no_empty: true,

                    process: function (node) {
                        node.target = '_blank';
                    }
                },
                'br': {
                    valid_styles: '',
                    valid_classes: ''
                }
            }
        },
        'strong': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        },
        'br': {
            valid_styles: '',
            valid_classes: ''
        },
        'a': {
            valid_styles: '',
            valid_classes: '',
            no_empty: true
        }
    };
    assert.ok(test(input, output, valid_elements), 'Полноценный тест');
});
